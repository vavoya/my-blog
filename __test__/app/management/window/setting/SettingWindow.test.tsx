import {beforeEach, describe, expect, test, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import SettingWindow from "@/app/management/_window/setting/SettingWindow";
import {ReactNode} from "react";
import ManagementProvider from "@/store/ManagementProvider";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {buildTrie} from "@/app/management/_utils/buildTrie";

// 모킹: asyncTaskManager, signOut 등 외부 의존성
vi.mock("next-auth/react", () => ({
    signOut: vi.fn()
}))
vi.mock("@/hook/useAsyncTaskManager", () => ({
    default: () => ({
        addAsyncTask: vi.fn()
    })
}))
import * as useAsyncTaskManager from "@/hook/useAsyncTaskManager";

// Mock userInfo
const mockUserInfo: UserInfoResponse = {
    _id: "1",
    user_name: "홍길동",
    blog_name: "길동이의 블로그",
    blog_url: "https://blog.com",
    auth_id: "auth1",
    email: "test@test.com",
    is_deleted: false,
    agreements: {email: false, terms: true, privacy: true},
    last_login_at: "",
    last_modified: "",
    next_post_id: 1,
    registration_state: true,
}

// Provider wrapper
function renderWithProvider(children: ReactNode) {
    return render(
        <ManagementProvider userInfo={mockUserInfo}
                            folderObj={{}}
                            seriesObj={{}}
                            setWindows={() => null}
                            trie={buildTrie({})}>
            {children}
        </ManagementProvider>
    )
}

const mockAsyncTaskManager = {
    isIdle: true,
    isError: false,
    addAsyncTask: vi.fn(),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    asyncTaskQueue: new Set(),
    prevValue: null,
    errorMessage: "",
    recentCompleted: [],
    completedCount: 0,
    observers: new Set(),
    addRecentCompleted: function (): void {
        throw new Error("Function not implemented.");
    },
    runAsyncTask: function (): Promise<void> {
        throw new Error("Function not implemented.");
    },
    clearAsyncTask: function (): void {
        throw new Error("Function not implemented.");
    },
    notify: function (): void {
        throw new Error("Function not implemented.");
    }
} as unknown as ReturnType<typeof useAsyncTaskManager.default>;
vi.spyOn(useAsyncTaskManager, 'default').mockReturnValue(mockAsyncTaskManager)

describe('SettingWindow', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    test('입력값 변경 반영', () => {
        renderWithProvider(<SettingWindow />)

        const userNameInput = screen.getByPlaceholderText("사용자 이름을 입력하세요") as HTMLInputElement
        fireEvent.change(userNameInput, { target: { value: "김테스터" } })
        expect(userNameInput.value).toBe("김테스터")
    })

    test('이메일 수신 체크박스 토글', () => {
        renderWithProvider(<SettingWindow />)
        const checkbox = screen.getByRole('checkbox') as HTMLInputElement
        expect(checkbox.checked).toBe(false)
        fireEvent.click(screen.getByText((_, el) => el!.className.includes('checkBox')))
        expect(checkbox.checked).toBe(true)
    })

    test('회원 탈퇴 버튼 클릭 시 모달 렌더링', async () => {
        renderWithProvider(<SettingWindow />)
        fireEvent.click(screen.getByText('탈퇴하기'))
        expect(await screen.findByText('계정 탈퇴')).toBeInTheDocument()
    })

    test('저장 버튼 클릭 시 asyncTask 호출', async () => {

        renderWithProvider(<SettingWindow />)

        const saveBtn = screen.getByText('저장')
        fireEvent.click(saveBtn)
        expect(mockAsyncTaskManager.addAsyncTask).toHaveBeenCalled()
    })
})

import {describe, expect, test, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import NavBody from "@/components/modal/folder/NavBody";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";


vi.mock("@/components/modal/components/NavItem", () => ({
    __esModule: true,
    default: ({onClick, name}: any) => <button data-testid="card-item" onClick={onClick}>{name}</button>,
}))


describe('NavBody', () => {
    describe('렌더링 분기 검증', () => {
        test('하위 폴더가 없는 경우 렌더링', () => {
            const setFolderPath = vi.fn();

            const userId = 'user-id'
            const folderInfo: FolderInfoResponse[] = [
                {
                    _id: '1',
                    user_id: userId,
                    pfolder_id: null,
                    folder_name: '루트',
                    post_count: 0
                },
                {
                    _id: '2',
                    user_id: userId,
                    pfolder_id: '1',
                    folder_name: '하위',
                    post_count: 0
                }
            ]

            render(
                <NavBody folderInfo={folderInfo}
                         folderPath={['1', '2']}
                         setFolderPath={setFolderPath} />
            )

            expect(screen.getByText('하위 폴더가 없어요')).toBeDefined()
        })

        test('하위 폴더가 존재하는 경우 렌더링', () => {
            const setFolderPath = vi.fn();

            const userId = 'user-id';
            const childFolderName = '하위';
            const folderInfo: FolderInfoResponse[] = [
                {
                    _id: '1',
                    user_id: userId,
                    pfolder_id: null,
                    folder_name: '루트',
                    post_count: 0
                },
                {
                    _id: '2',
                    user_id: userId,
                    pfolder_id: '1',
                    folder_name: childFolderName,
                    post_count: 0
                }
            ]

            render(
                <NavBody folderInfo={folderInfo}
                         folderPath={['1']}
                         setFolderPath={setFolderPath} />
            )

            expect(screen.getByText(childFolderName)).toBeDefined()
        })
    })

    describe('함수 호출 검증', () => {
        test('하위 폴더 이동', () => {
            const setFolderPath = vi.fn();

            const userId = 'user-id';
            const childFolderName = '하위';
            const folderInfo: FolderInfoResponse[] = [
                {
                    _id: '1',
                    user_id: userId,
                    pfolder_id: null,
                    folder_name: '루트',
                    post_count: 0
                },
                {
                    _id: '2',
                    user_id: userId,
                    pfolder_id: '1',
                    folder_name: childFolderName,
                    post_count: 0
                }
            ]

            render(
                <NavBody folderInfo={folderInfo}
                         folderPath={['1']}
                         setFolderPath={setFolderPath} />
            )

            const child = screen.getByTestId('card-item');
            fireEvent.click(child)

            expect(setFolderPath).toBeCalledWith(['1', '2'])
        })
    })
})
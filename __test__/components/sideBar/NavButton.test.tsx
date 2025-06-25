import {describe, expect, test, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";

vi.mock('@/components/modal/folder/Modal', () => ({
    __esModule: true,
    default: ({ closeModal }: any) => {
        return (
        <div data-testid="modal" onClick={(event) => {
            event.stopPropagation();
            closeModal();
        }}>modal</div>
        )
    },
}))

import {NavButton} from "@/components/sideBar/folder/NavButton";

describe('NavButton', () => {
    test('모달 열기 동작', () => {
        render(
            <NavButton userId={'1'}
                       url={{blog: '1'}}
                       initPageNumber={1}
                       initFolderId={'1'}
                       folderInfo={[
                           {
                               _id: '1',
                               user_id: '1',
                               folder_name: '1',
                               pfolder_id: null,
                               post_count: 0,
                           }
                       ]} />
        )

        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(screen.getByTestId('modal')).toBeInTheDocument()
    })

    test('모달 닫기 동작', () =>{
        render(
            <NavButton userId={'1'}
                       url={{blog: '1'}}
                       initPageNumber={1}
                       initFolderId={'1'}
                       folderInfo={[
                           {
                               _id: '1',
                               user_id: '1',
                               folder_name: '1',
                               pfolder_id: null,
                               post_count: 0,
                           }
                       ]} />,
        )

        fireEvent.click(screen.getByRole("button"));
        fireEvent.click(screen.getByText("modal"));
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    })
})
import {describe, expect, test} from "vitest";
import {renderPage, folderInfos} from "@/__test__/app/management/_utils/renderPage";
import {fireEvent, screen} from "@testing-library/react";


describe('초기 렌더링 테스트', () => {
    test('폴더 트리 렌더링 여부 (중첩 검사 x)', () => {
        renderPage();
        fireEvent.click(screen.getByText('폴더 편집'))

        // 폴더 윈도우 열림 검사
        expect(screen.getByText('폴더 트리')).toBeInTheDocument();
        // 폴더 렌더링 여부 검사
        folderInfos.forEach(folderInfo => {
            const folderItem = document.getElementById(folderInfo._id)
            expect(folderItem).toHaveTextContent(folderInfo.folder_name)
            expect(folderItem).toHaveTextContent(folderInfo.post_count.toString())
        })
    })
})
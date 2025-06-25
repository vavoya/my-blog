import {describe, expect, test, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import NavHeader from "@/components/modal/folder/NavHeader";


describe('NavHeader', () => {
    describe('렌더링 분기 검증', () => {
        test('상위 폴더가 존재', () => {
            render(
                <NavHeader folderPath={['1', '2']}
                           setFolderPath={() => null} />
            )

            expect(screen.getByText('이전')).toBeDefined()
        })

        test('상위 폴더가 없음', () => {
            render(
                <NavHeader folderPath={['1']}
                           setFolderPath={() => null} />
            )

            expect(screen.queryByText('이전')).toBeNull()
        })
    })

    describe('onClick 검증', () => {
        test('상위 경로 이동', () => {
            const setFolderPath = vi.fn()

            render(
                <NavHeader folderPath={['1', '2']}
                           setFolderPath={setFolderPath} />
            )

            fireEvent.click(screen.getByText('이전'))

            expect(setFolderPath).toBeCalledWith(['1'])
        })
    })
})
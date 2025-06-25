import {describe, expect, test, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import SearchFolder from "@/app/management/_components/search-folder/SearchFolder";
import {FolderObj, toObj} from "@/components/modal/utils/toObj";
import {buildTrie} from "@/app/management/_utils/buildTrie";
import {buildFolderPath} from "@/utils/buildFolderPath";
import {act} from "react";

const selectFolder = vi.fn();
const folderObj: FolderObj = toObj([
    {
        _id: '1',
        user_id: '1',
        pfolder_id: null,
        folder_name: '~',
        post_count: 0
    },
    {
        _id: '2',
        user_id: '1',
        pfolder_id: '1',
        folder_name: '폴더1',
        post_count: 0
    },
    {
        _id: '3',
        user_id: '1',
        pfolder_id: '1',
        folder_name: '폴더2',
        post_count: 0
    },
    {
        _id: '4',
        user_id: '1',
        pfolder_id: '3',
        folder_name: '폴더3',
        post_count: 0
    }
]);
const trie = buildTrie(folderObj);

describe('SearchFolder', () => {
    describe('입력에 따른 목록 렌더링', () => {
        test('목록 렌더링 O - 완전 일치', () => {
            render(
                <SearchFolder selectFolder={selectFolder} folderObj={folderObj} trie={trie} />
            )

            const searchText = '폴더3'
            fireEvent.change(screen.getByPlaceholderText('이동할 폴더 이름을 입력하세요.'), { target: { value: searchText } });
            const folder = Object.values(folderObj).find(v => v.folder_name === searchText);
            expect(screen.getByText(buildFolderPath(folder!, folderObj))).toBeInTheDocument()
        })

        test('목록 렌더링 O - startWith 일지', () => {
            render(
                <SearchFolder selectFolder={selectFolder} folderObj={folderObj} trie={trie} />
            )

            const searchText = '폴더'
            fireEvent.change(screen.getByPlaceholderText('이동할 폴더 이름을 입력하세요.'), { target: { value: searchText } });

            Object.values(folderObj).forEach(v => {
                if (v.folder_name.startsWith(searchText)) {
                    expect(screen.getByText(buildFolderPath(v, folderObj))).toBeInTheDocument()
                }
            })
        })

        test('목록 렌더링 X', () => {
            render(
                <SearchFolder selectFolder={selectFolder} folderObj={folderObj} trie={trie} />
            )

            Object.values(folderObj).forEach(v => {
                expect(screen.queryByText(buildFolderPath(v, folderObj))).not.toBeInTheDocument()
            })
        })
    })

    describe('클릭에 따른 동작 및 렌더링', () => {
        test('외부 클릭 시 목록 사라지기', () => {
            render(
                <SearchFolder selectFolder={selectFolder} folderObj={folderObj} trie={trie} />
            )

            const searchText = '폴더3'
            fireEvent.change(screen.getByPlaceholderText('이동할 폴더 이름을 입력하세요.'), { target: { value: searchText } });
            const folder = Object.values(folderObj).find(v => v.folder_name === searchText);
            expect(screen.getByText(buildFolderPath(folder!, folderObj))).toBeInTheDocument();

            act(() => {
                document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
            })
            expect(screen.queryByText(buildFolderPath(folder!, folderObj))).not.toBeInTheDocument();
        })

        test('목록 아이템 클릭 시, 해당 목록을 선택으로 렌더링', () => {
            render(
                <SearchFolder selectFolder={selectFolder} folderObj={folderObj} trie={trie} />
            )

            const searchText = '폴더3'
            const folder = selectSearchFolder(searchText, folderObj);

            const selectedFolder = document.querySelector('span')
            expect(selectedFolder).toHaveTextContent(buildFolderPath(folder!, folderObj))
        })
    })
})

export function selectSearchFolder(searchText: string, folderObj: FolderObj) {
    fireEvent.change(screen.getByPlaceholderText('이동할 폴더 이름을 입력하세요.'), { target: { value: searchText } });
    const folder = Object.values(folderObj).find(v => v.folder_name === searchText);
    const searchItem = screen.getByText(buildFolderPath(folder!, folderObj))
    expect(searchItem).toBeInTheDocument();

    fireEvent.click(searchItem)

    return folder
}
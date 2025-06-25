import {describe, expect, test, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import CardSection from "@/components/modal/folder/CardSection";
import {toObj} from "@/components/modal/utils/toObj";


vi.mock('/components/modal/components/Pagination', () => ({
    __esModule: true,
    default: ({ pageNum }: any) => <div data-testid="pagination">{pageNum}</div>,
}))
vi.mock('/components/modal/components/PaginationSearch', () => ({
    __esModule: true,
    default: () => <div data-testid="pagination-search" />,
}))
vi.mock('/components/modal/folder/CardBody', () => ({
    __esModule: true,
    default: ({ path }: any) => <div data-testid="card-body">{path}</div>,
}))
vi.mock('@/components/modal/_queries/usePaginatedPostsQuery', () => ({
    usePaginatedPostsQuery: () => ({
        data: undefined,
        isFetching: true,
    })
}))

describe('CardSection', () => {
    test('폴더 변경 시 페이지 번호 초기화', () => {
        const userId = 'user-id';
        const url = {blog: ''};
        const folderObj = toObj([
            {
                _id: '1',
                user_id: userId,
                pfolder_id: null,
                folder_name: '루트',
                post_count: 14
            },
            {
                _id: '2',
                user_id: userId,
                pfolder_id: '1',
                folder_name: '자식',
                post_count: 0
            }
        ])
        const { rerender } = render(
            <CardSection userId={userId}
                         url={url}
                         folderObj={folderObj}
                         folderPath={['1', '2']}
                         initPageNumber={2} />
        )
        expect(screen.getByTestId('pagination')).toHaveTextContent('2')
        rerender(
            <CardSection userId={userId}
                         url={url}
                         folderObj={folderObj}
                         folderPath={['1']}
                         initPageNumber={2} />
        )
        expect(screen.getByTestId('pagination')).toHaveTextContent('1')
    })

    test('path 문자열 계산', () => {
        const userId = 'user-id';
        const url = {blog: ''};
        const folderObj = toObj([
            {
                _id: '1',
                user_id: userId,
                pfolder_id: null,
                folder_name: '루트',
                post_count: 14
            },
            {
                _id: '2',
                user_id: userId,
                pfolder_id: '1',
                folder_name: '자식',
                post_count: 0
            }
        ])
        const folderPath = ['1', '2'];
        render(
            <CardSection userId={userId}
                         url={url}
                         folderObj={folderObj}
                         folderPath={folderPath}
                         initPageNumber={2} />
        )

        const path = folderPath.map(folderId => folderObj[folderId].folder_name).join('/');
        expect(screen.getByTestId('card-body')).toHaveTextContent(path)
    })


})
import {describe, expect, test, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import CardSection from "@/components/modal/series/CardSection";
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
vi.mock('@/hook/usePaginatedPostIdsQuery', () => ({
    usePaginatedPostIdsQuery: () => ({
        isFetching: true,
        data: undefined,
        isError: false,
        errorMessage: ''
    })
}))

describe('CardSection', () => {
    test('시리즈 변경 시 페이지 번호 초기화', () => {
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
        const seriesObj = toObj([
            {
                _id: '1',
                user_id: userId,
                series_name: '시리즈1',
                series_description: '',
                post_list: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                _id: '2',
                user_id: userId,
                series_name: '시리즈2',
                series_description: '',
                post_list: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ])
        const { rerender } = render(
            <CardSection userId={userId}
                         url={url}
                         folderObj={folderObj}
                         seriesObj={seriesObj}
                         seriesId={'1'}
                         initPageNumber={2} />
        )
        expect(screen.getByTestId('pagination')).toHaveTextContent('2')
        rerender(
            <CardSection userId={userId}
                         url={url}
                         folderObj={folderObj}
                         seriesObj={seriesObj}
                         seriesId={'2'}
                         initPageNumber={2} />
        )
        expect(screen.getByTestId('pagination')).toHaveTextContent('1')
    })

    test('선택한 시리즈 ID 없음', () => {
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
        const seriesObj = toObj([
            {
                _id: '1',
                user_id: userId,
                series_name: '시리즈1',
                series_description: '',
                post_list: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                _id: '2',
                user_id: userId,
                series_name: '시리즈2',
                series_description: '',
                post_list: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ])
        render(
            <CardSection userId={userId}
                         url={url}
                         folderObj={folderObj}
                         seriesObj={seriesObj}
                         seriesId={null}
                         initPageNumber={2} />
        )
        expect(screen.getByText('시리즈를 선택하세요')).toBeDefined()
    })
})
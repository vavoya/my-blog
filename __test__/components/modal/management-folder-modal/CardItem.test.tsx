import {beforeEach, describe, expect, test, vi} from "vitest";
import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import CardItem from "@/components/modal/management-folder-modal/CardItem";
import {PaginatedPostsResponse} from "@/data-access/post-info/types";


// Image mocking
vi.mock("next/image", () => ({
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    default: ({ src, alt, fill, objectFit, ...props }: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt} {...props} />;
    }

}));
vi.mock("@/components/modal/components/MoveBackgroundAnimation", () => ({
    __esModule: true,
    default: () => <div data-testid="animation" />,
}))

beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", { configurable: true, value: 100 })
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", { configurable: true, value: 50 })
})
describe('CardItem', () => {
    test('시리즈에 추가 불가능한 항목(disabled)', () => {
        const paginatedPost: PaginatedPostsResponse = {
            _id: '1',
            folder_id: '1',
            post_createdAt: new Date().toISOString(),
            post_description: '',
            post_name: '테스트',
            post_updatedAt: new Date().toISOString(),
            post_url: 'haha',
            series_id: '1',
            thumb_url: ''
        };
        const { container } = render(
            <CardItem paginatedPost={paginatedPost}
                      seriesId={paginatedPost.series_id!}
                      setPost={() => null}
                      path={'의미없음'} />
        )
        const overlay = container.querySelector("#disabled-overlay")
        expect(overlay).toBeDefined()
    })

    test('시리즈에 추가 가능한 항목은 애니메이션 커버', () => {
        const paginatedPost: PaginatedPostsResponse = {
            _id: '1',
            folder_id: '1',
            post_createdAt: new Date().toISOString(),
            post_description: '',
            post_name: '테스트',
            post_updatedAt: new Date().toISOString(),
            post_url: 'haha',
            series_id: null,
            thumb_url: ''
        }
        render(
            <CardItem paginatedPost={paginatedPost}
                      seriesId={'2'}
                      setPost={() => null}
                      path={'의미없음'} />
        )
        expect(screen.getByTestId('animation')).toBeDefined()
    })

    test('시리즈에 추가 함수 실행(click)', () => {
        const setPost = vi.fn();
        const paginatedPost: PaginatedPostsResponse = {
            _id: '1',
            folder_id: '1',
            post_createdAt: new Date().toISOString(),
            post_description: '',
            post_name: '테스트',
            post_updatedAt: new Date().toISOString(),
            post_url: 'haha',
            series_id: null,
            thumb_url: ''
        }
        const { container } = render(
            <CardItem paginatedPost={paginatedPost}
                      seriesId={'2'}
                      setPost={setPost}
                      path={'의미없음'} />
        )

        const items = Array.from(container.querySelectorAll('div'))
            .filter(el => el.className.includes('modalCardItem'));
        fireEvent.click(items[0] as HTMLElement);
        expect(setPost).toBeCalledWith(paginatedPost)
    })
})
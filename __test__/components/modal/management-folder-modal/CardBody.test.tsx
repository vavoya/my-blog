import {describe, expect, test, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import CardBody, {LOADING_MESSAGE, NO_POSTS_MESSAGE} from "@/components/modal/management-folder-modal/CardBody";


vi.mock("@/components/modal/management-folder-modal/CardItem", () => ({
    __esModule: true,
    default: () => <div data-testid="card-item"/>,
}))


describe('CardBody', () => {
    test('isLoading 상태 렌더링', () => {
        render(
            <CardBody isLoading={true}
                      isError={false}
                      errorMessage={''}
                      postCount={0}
                      paginatedPosts={[]}
                      path={''}
                      seriesId={""}
                      setPost={() => null} />
        )

        expect(screen.getByText(LOADING_MESSAGE)).toBeDefined();
    })


    test('isError 상태 렌더링', () => {
        const errorMessage = 'error message';
        render(
            <CardBody isLoading={false}
                      isError={true}
                      errorMessage={errorMessage}
                      postCount={0}
                      paginatedPosts={[]}
                      path={''}
                      seriesId={""}
                      setPost={() => null} />
        )

        expect(screen.getByText(errorMessage)).toBeDefined();

    })

    test('postCount === 0 상태 렌더링', () => {
        render(
            <CardBody isLoading={false}
                      isError={false}
                      errorMessage={''}
                      postCount={0}
                      paginatedPosts={[]}
                      path={''}
                      seriesId={""}
                      setPost={() => null} />
        )

        expect(screen.getByText(NO_POSTS_MESSAGE)).toBeDefined();
    })

    test('post 렌더링', () => {
        render(
            <CardBody isLoading={false}
                      isError={false}
                      errorMessage={''}
                      postCount={1}
                      paginatedPosts={[
                          {
                              _id: "",
                              post_url: "",
                              post_description: "",
                              post_name: "",
                              post_createdAt: "",
                              post_updatedAt: "",
                              thumb_url: "",
                              folder_id: "",
                              series_id: null
                          }
                      ]}
                      path={''}
                      seriesId={""}
                      setPost={() => null} />
        )

        expect(screen.getByTestId('card-item')).toBeDefined();
    })
})
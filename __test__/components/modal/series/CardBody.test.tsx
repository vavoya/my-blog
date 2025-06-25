import {describe, expect, test, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import CardBody, {LOADING_MESSAGE, NO_POSTS_MESSAGE} from "@/components/modal/series/CardBody";


vi.mock("@/components/modal/components/CardItem", () => ({
    __esModule: true,
    default: () => <div data-testid="card-item" />,
}))

describe('CardBody', () => {
    test('isLoading', () => {
        render(
            <CardBody isLoading={true}
                      isError={false}
                      errorMessage={''}
                      postCount={0}
                      url={{blog: ''}}
                      paginatedPosts={[]}
                      series={{
                          _id: "",
                          user_id: "",
                          series_name: "",
                          series_description: "",
                          post_list: [],
                          createdAt: "",
                          updatedAt: ""}}
                      folderObj={{}}/>
        )

        expect(screen.getByText(LOADING_MESSAGE)).toBeDefined();
    })

    test('isError', () => {
        const errorMessage = 'error message';
        render(
            <CardBody isLoading={false}
                      isError={true}
                      errorMessage={errorMessage}
                      postCount={0}
                      url={{blog: ''}}
                      paginatedPosts={[]}
                      series={{
                          _id: "",
                          user_id: "",
                          series_name: "",
                          series_description: "",
                          post_list: [],
                          createdAt: "",
                          updatedAt: ""}}
                      folderObj={{}}/>
        )

        expect(screen.getByText(errorMessage)).toBeDefined();
    })

    test('postCount === 0', () => {
        render(
            <CardBody isLoading={false}
                      isError={false}
                      errorMessage={''}
                      postCount={0}
                      url={{blog: ''}}
                      paginatedPosts={[]}
                      series={{
                          _id: "",
                          user_id: "",
                          series_name: "",
                          series_description: "",
                          post_list: [],
                          createdAt: "",
                          updatedAt: ""}}
                      folderObj={{}}/>
        )

        expect(screen.getByText(NO_POSTS_MESSAGE)).toBeDefined();
    })

    test('post', () => {
        render(
            <CardBody isLoading={false}
                      isError={false}
                      errorMessage={''}
                      postCount={1}
                      url={{blog: ''}}
                      paginatedPosts={[
                          {
                              _id: "1",
                              post_url: "",
                              post_description: "",
                              post_name: "",
                              post_createdAt: "",
                              post_updatedAt: "",
                              thumb_url: "",
                              folder_id: "1",
                              series_id: null
                          }
                      ]}
                      series={{
                          _id: "",
                          user_id: "",
                          series_name: "",
                          series_description: "",
                          post_list: ['1'],
                          createdAt: "",
                          updatedAt: ""}}
                      folderObj={{
                          '1': {
                              _id: '1',
                              user_id: '',
                              pfolder_id: null,
                              folder_name: '루트',
                              post_count: 1,
                          }
                      }}/>
        )

        expect(screen.getByTestId('card-item')).toBeDefined();
    })
})
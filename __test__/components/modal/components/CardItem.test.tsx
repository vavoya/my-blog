import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, test, vi, expect, beforeEach } from "vitest"
import CardItem from "@/components/modal/components/CardItem"

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

vi.mock("@/utils/formatDate", () => ({
    formatDate: (date: Date) => "formatted-date",
}))

vi.mock("@/components/ProcessingOverlayLink", () => {
    const Component = React.forwardRef((props: any, ref: any) => {
        return <a ref={ref} {...props}>{props.children}</a>
    })
    Component.displayName = "ProcessingOverlayLinkMock"

    return {
        __esModule: true,
        default: Component
    }
})


vi.mock("@/components/modal/series/SeriesOrderBox", () => ({
    __esModule: true,
    default: ({ sereisOrder }: any) => <div data-testid="series">{sereisOrder}</div>
}))

beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", { configurable: true, value: 100 })
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", { configurable: true, value: 50 })
})

describe("CardItem", () => {
    test("기본 정보가 렌더링된다", () => {
        render(<CardItem
            url={{ blog: "myblog", post: "test-post" }}
            href="/myblog/test-post"
            thumbUrl="http://image.jpg"
            name="Post Title"
            description="Description"
            createdAt="2023-01-01T00:00:00.000Z"
            path="my/path"
        />)

        expect(screen.getByText("Post Title")).toBeDefined()
        expect(screen.getByText("Description")).toBeDefined()
        expect(screen.getByText("my/path")).toBeDefined()
        expect(screen.getByText("formatted-date")).toBeDefined()
        expect(screen.getByRole("img")).toHaveAttribute("src", "http://image.jpg")
    })

    test("seriesOrder가 0이면 SeriesOrderBox가 렌더링되지 않는다", () => {
        render(<CardItem
            url={{ blog: "blog", post: "post" }}
            href="/blog/post"
            thumbUrl=""
            name="title"
            description="desc"
            createdAt="2023-01-01"
            path=""
            seriesOrder={0}
        />)

        expect(screen.queryByTestId("series")).toBeNull()
    })

    test("seriesOrder가 1 이상이면 SeriesOrderBox가 렌더링된다", () => {
        render(<CardItem
            url={{ blog: "blog", post: "post" }}
            href="/blog/post"
            thumbUrl=""
            name="title"
            description="desc"
            createdAt="2023-01-01"
            path=""
            seriesOrder={2}
        />)

        expect(screen.getByTestId("series")).toHaveTextContent("2")
    })

    test("href와 currentHref가 같으면 overlay div가 렌더링된다", () => {
        render(<CardItem
            url={{ blog: "a", post: "b" }}
            href="/a/b"
            thumbUrl=""
            name=""
            description=""
            createdAt="2023-01-01"
            path=""
        />)

        const overlay = screen.getByRole("link").querySelector("div")
        expect(overlay).toHaveStyle({ backgroundColor: expect.stringContaining("rgba") })
    })

    test("href와 currentHref가 다르면 애니메이션이 렌더링된다", () => {
        render(<CardItem
            url={{ blog: "a", post: "b" }}
            href="/a/other"
            thumbUrl=""
            name=""
            description=""
            createdAt="2023-01-01"
            path=""
        />)

        expect(screen.getByTestId("animation")).toBeDefined()
    })

})
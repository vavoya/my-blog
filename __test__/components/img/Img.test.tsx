// Img.initRender.test.tsx
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {describe, vi, test, expect} from "vitest";
import Img, {ERROR_MESSAGE} from "@/components/img/Img";

// Image mocking
vi.mock("next/image", () => ({
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    default: ({ src, alt, fill, objectFit, ...props }: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt} {...props} />;
    }

}));


describe('이미지 컴포넌트', () => {
    test('src가 없으면 null을 반환', () => {
        const { container } = render(<Img src={""} />);
        expect(container.firstChild).toBeNull();
    })

    test('유효하지 않은 url이면 경고 메시지를 렌더링한다', () => {
        render(<Img src={"invalid-url"} />);
        expect(screen.getByText(ERROR_MESSAGE.INVALID_URL)).toBeDefined();
    })

    test("유효한 url이면 이미지가 렌더링된다", () => {
        render(<Img src={"http://valid.url"} />)
        const image = screen.getByRole("img")
        expect(image).toHaveAttribute("src", "http://valid.url")
    })

    test("이미지 로딩 실패 시 에러 메시지를 렌더링한다", async () => {
        render(<Img src={"http://valid.url"} />)
        const image = screen.getByRole("img")

        fireEvent.error(image)

        await waitFor(() => {
            expect(screen.getByText("이미지를 불러올 수 없습니다.")).toBeDefined()
        })
    })
})
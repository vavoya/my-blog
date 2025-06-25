import { describe, test, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import PaginationSearch from "@/components/modal/components/PaginationSearch"

const mockFn = vi.fn()

beforeEach(() => {
    mockFn.mockReset()
})

function setup(maxPageNum: number) {
    render(<PaginationSearch getPaginatedPosts={mockFn} maxPageNum={maxPageNum} />)
    const input = screen.getByPlaceholderText("숫자") as HTMLInputElement
    const button = screen.getByRole("button")
    return { input, button }
}

describe("PaginationSearch", () => {
    test("유효한 숫자 입력 시 getPaginatedPosts 호출", () => {
        const { input, button } = setup(10)
        input.value = "5"
        fireEvent.click(button)
        expect(mockFn).toHaveBeenCalledWith(5)
    })

    test("숫자가 아닌 문자열 입력 시 호출되지 않음", () => {
        const { input, button } = setup(10)
        input.value = "abc"
        fireEvent.click(button)
        expect(mockFn).not.toHaveBeenCalled()
    })

    test("0 입력 시 호출되지 않음", () => {
        const { input, button } = setup(10)
        input.value = "0"
        fireEvent.click(button)
        expect(mockFn).not.toHaveBeenCalled()
    })

    test("음수 입력 시 호출되지 않음", () => {
        const { input, button } = setup(10)
        input.value = "-3"
        fireEvent.click(button)
        expect(mockFn).not.toHaveBeenCalled()
    })

    test("maxPageNum 초과 입력 시 호출되지 않음", () => {
        const { input, button } = setup(5)
        input.value = "6"
        fireEvent.click(button)
        expect(mockFn).not.toHaveBeenCalled()
    })

    test("maxPageNum과 같은 값 입력 시 호출됨", () => {
        const { input, button } = setup(7)
        input.value = "7"
        fireEvent.click(button)
        expect(mockFn).toHaveBeenCalledWith(7)
    })
})

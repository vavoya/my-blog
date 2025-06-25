import { describe, expect, test, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Pagination from "@/components/modal/components/Pagination";

const mockFn = vi.fn((pageNum: number) => null);

beforeEach(() => {
    mockFn.mockReset();
});

describe("Pagination", () => {
    const renderPagination = (pageNum: number, maxPageNum: number) => {
        render(<Pagination getPaginatedPosts={mockFn} pageNum={pageNum} maxPageNum={maxPageNum} />);
        return screen.getAllByRole("button");
    };

    describe("버튼 활성화 조건", () => {
        test("최대 페이지가 1일 때 모든 버튼 비활성화", () => {
            const [firstBtn, prevBtn, nextBtn, lastBtn] = renderPagination(1, 1);
            expect(firstBtn).toBeDisabled();
            expect(prevBtn).toBeDisabled();
            expect(nextBtn).toBeDisabled();
            expect(lastBtn).toBeDisabled();
        });

        test("다음 버튼 활성화", () => {
            const [, , nextBtn] = renderPagination(1, 2);
            expect(nextBtn).toBeEnabled();
        });

        test("마지막 버튼 활성화", () => {
            const [, , , lastBtn] = renderPagination(1, 3);
            expect(lastBtn).toBeEnabled();
        });

        test("이전 버튼 활성화", () => {
            const [, prevBtn] = renderPagination(2, 3);
            expect(prevBtn).toBeEnabled();
        });

        test("처음 버튼 활성화", () => {
            const [firstBtn] = renderPagination(3, 3);
            expect(firstBtn).toBeEnabled();
        });
    });

    describe("버튼 클릭 동작", () => {
        test("다음 버튼 클릭 시 pageNum + 1 호출", () => {
            const currentPage = 1;
            const [, , nextBtn] = renderPagination(currentPage, 3);
            fireEvent.click(nextBtn);
            expect(mockFn).toHaveBeenCalledWith(currentPage + 1);
        });

        test("마지막 버튼 클릭 시 maxPageNum - 1 호출", () => {
            const lastPage = 5;
            const [, , , lastBtn] = renderPagination(1, lastPage);
            fireEvent.click(lastBtn);
            expect(mockFn).toHaveBeenCalledWith(lastPage);
        });

        test("이전 버튼 클릭 시 pageNum - 1 호출", () => {
            const currentPage = 3;
            const [, prevBtn] = renderPagination(currentPage, 3);
            fireEvent.click(prevBtn);
            expect(mockFn).toHaveBeenCalledWith(currentPage - 1);
        });

        test("처음 버튼 클릭 시 1 호출", () => {
            const [firstBtn] = renderPagination(3, 3);
            fireEvent.click(firstBtn);
            expect(mockFn).toHaveBeenCalledWith(1);
        });
    });
});

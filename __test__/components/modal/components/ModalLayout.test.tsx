import {describe, vi, test, expect} from "vitest";
import { render, screen, fireEvent } from "@testing-library/react"
import ModalLayout from "@/components/modal/components/ModalLayout";
import {QueryClient} from "@tanstack/query-core";


vi.mock("@/components/svg/Close", () => ({
    __esModule: true,
    default: () => <div data-testid="close-svg" />,
}))

vi.mock("@/components/modal/components/nav-button/NavCloseButton", () => ({
    __esModule: true,
    default: ({ onClick }: any) => <button data-testid="nav-close-button" onClick={onClick}>Close</button>,
}))

vi.mock("@/components/modal/components/nav-button/NavOpenButton", () => ({
    __esModule: true,
    default: ({ onClick }: any) => <button data-testid="nav-open-button" onClick={onClick}>Open</button>,
}))


function openModalLayout() {
    const closeModal = vi.fn();
    const queryClient = new QueryClient();

    render(
        <ModalLayout
            closeModal={closeModal}
            NavHeader={<div data-testid="header" />}
            NavBody={<div data-testid="body" />}
            CardSection={<div data-testid="card-section" />}
            queryClient={queryClient} />
    );

    return { closeModal }
}

describe('ModalLayout', () => {
    test("닫기 버튼 클릭 시 closeModal 호출", () => {
        const { closeModal } = openModalLayout()
        const closeButton = screen.getByRole("button", { name: "" }) // SvgClose 버튼
        fireEvent.click(closeButton)
        expect(closeModal).toHaveBeenCalled()
    })

    test("배경 클릭 시 closeModal 호출", () => {
        const { closeModal } = openModalLayout()

        const backdrop = screen.getByText((_, el) => !!el?.className.includes("backdrop"))
        fireEvent.click(backdrop)
        expect(closeModal).toHaveBeenCalled()
    })

    test("Escape 키 눌렀을 때 closeModal 호출", () => {
        const { closeModal } = openModalLayout()
        fireEvent.keyDown(document, { key: "Escape" })
        expect(closeModal).toHaveBeenCalled()
    })

    test("NavOpenButton 클릭 시 nav 영역 열림", () => {
        openModalLayout();
        fireEvent.click(screen.getByTestId('nav-open-button'));
        const navSection = screen.getByText((_, el) => !!el?.className.includes('modalNavSection'))
        expect(navSection.className).toContain('open')
    })
})
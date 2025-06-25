import {afterEach, describe, expect, test} from "vitest";
import useToast from "@/app/management/_hook/toast/useToast";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {act} from "react";

function TestComponent() {
    const addToast = useToast()
    return (
        <button onClick={() => addToast({
            id: 't1',
            type: 'info',
            message: '테스트 메시지',
            height: 0
        })}>토스트 호출</button>
    )
}

describe('useToast', () => {
    afterEach(() => {
        const el = document.querySelector('#toast-container');
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });
    test('토스트 컨테이너 생성', () => {
        render(<TestComponent />)

        fireEvent.click(screen.getByText('토스트 호출'))
        expect(document.querySelector('#toast-container')).toBeInTheDocument()
    })

    test('토스트 아이템 생성', () => {
        render(<TestComponent />)

        fireEvent.click(screen.getByText('토스트 호출'))
        const toastItem = screen.getByText('테스트 메시지');
        expect(toastItem).toBeInTheDocument()
    })

    test('토스트 아이템 제거', async () => {
        render(<TestComponent />)

        fireEvent.click(screen.getByText('토스트 호출'))
        const toastItem = screen.getByText('테스트 메시지');
        expect(toastItem).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.queryByText('테스트 메시지')).not.toBeInTheDocument()
        }, { timeout: 5000 })
    })

    test('popState에 따른 토스트 컨테이너 언마운트', () => {
        render(<TestComponent />)

        fireEvent.click(screen.getByText('토스트 호출'))
        const toastItem = screen.getByText('테스트 메시지');
        expect(toastItem).toBeInTheDocument()

        act(() => {
            window.dispatchEvent(new PopStateEvent('popstate'))
        })
        expect(document.querySelector('#toast-container')).not.toBeInTheDocument()
    })
})
import {afterEach, beforeEach, describe, vi, it, expect} from 'vitest'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {act} from 'react'

// next/navigation 모킹
vi.mock('next/navigation', () => ({
    usePathname: () => '/current-path'
}))

// 완전히 navigation 막는 Link mock
vi.mock('next/link', () => ({
    __esModule: true,
    default: ({ onClick, children }: any) => (
        <button onClick={onClick} data-testid="mock-link">
            {children}
        </button>
    )
}))

// Overlay 모킹
vi.mock('@/components/processing-overlay/ProcessingOverlay', () => ({
    __esModule: true,
    default: ({text}: {text: string}) => (
        <div data-testid="processing-overlay">{text}</div>
    )
}))

import ProcessingOverlayLink from '@/components/ProcessingOverlayLink'

describe('ProcessingOverlayLink', () => {
    beforeEach(() => {
        vi.useFakeTimers({
            shouldAdvanceTime: true,
            advanceTimeDelta: 1
        })
    })

    afterEach(() => {
        vi.runOnlyPendingTimers()
        vi.useRealTimers()
    })

    it('다른 경로 클릭 시 overlay가 나타난다', async () => {
        const user = userEvent.setup()

        render(
            <ProcessingOverlayLink href="/other-path">
                이동
            </ProcessingOverlayLink>
        )

        expect(screen.queryByTestId('processing-overlay')).toBeNull()

        await user.click(screen.getByTestId('mock-link'))

        expect(screen.getByTestId('processing-overlay')).toBeInTheDocument()
        expect(screen.getByTestId('processing-overlay').textContent).toMatch(/페이지 이동 중입니다/)
    })

    it('같은 경로 클릭 시 overlay가 나타나지 않고 이동도 막는다', async () => {
        const user = userEvent.setup()
        const onClick = vi.fn((e) => e.preventDefault())

        render(
            <ProcessingOverlayLink href="/current-path" onClick={onClick}>
                현재
            </ProcessingOverlayLink>
        )

        await user.click(screen.getByTestId('mock-link'))

        expect(onClick).toHaveBeenCalled()
        expect(screen.queryByTestId('processing-overlay')).toBeNull()
    })

    it('processingText는 500ms마다 점을 순환적으로 추가한다', async () => {
        const user = userEvent.setup()

        render(
            <ProcessingOverlayLink href="/other-path">
                처리중
            </ProcessingOverlayLink>
        )

        // 클릭은 반드시 act로 감싸야 함
        await act(async () => {
            await user.click(screen.getByTestId('mock-link'))
        })

        const overlay = () => screen.getByTestId('processing-overlay')

        expect(overlay().textContent).toBe('페이지 이동 중입니다')

        // 1000ms 후 상태 갱신을 act + waitFor 로 확인
        act(() => {
            vi.advanceTimersByTime(1000)
        })
        await waitFor(() => {
            expect(screen.getByTestId('processing-overlay').textContent).toBe('페이지 이동 중입니다.')
        })

        // 999ms 후 상태 갱신을 act + waitFor 로 확인
        act(() => {
            vi.advanceTimersByTime(999)
        })
        await waitFor(() => {
            expect(screen.getByTestId('processing-overlay').textContent).toBe('페이지 이동 중입니다..')
        })

        // 999ms 후 상태 갱신을 act + waitFor 로 확인
        act(() => {
            vi.advanceTimersByTime(999)
        })
        await waitFor(() => {
            expect(screen.getByTestId('processing-overlay').textContent).toBe('페이지 이동 중입니다...')
        })

        // 999ms 후 상태 갱신을 act + waitFor 로 확인
        act(() => {
            vi.advanceTimersByTime(999)
        })
        await waitFor(() => {
            expect(screen.getByTestId('processing-overlay').textContent).toBe('페이지 이동 중입니다.')
        })
    })
})


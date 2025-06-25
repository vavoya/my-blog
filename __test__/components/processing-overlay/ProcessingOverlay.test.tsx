import {expect, test, vi} from "vitest";
import {fireEvent, render} from "@testing-library/react";
import ProcessingOverlay from "@/components/processing-overlay/ProcessingOverlay";


test('ProcessingOverlay 클릭', () => {
    const onClick = vi.fn()
    const { container } = render(
        <ProcessingOverlay text={'처리 중...'} onClick={onClick} />
    )

    // div의 자식인 button 클릭
    const element = container.querySelector('#processing-overlay')?.firstChild
    fireEvent.click(element as HTMLElement)
    expect(onClick).toBeCalled()
})
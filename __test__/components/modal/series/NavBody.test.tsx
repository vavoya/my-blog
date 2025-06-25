import {describe, expect, test, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import NavBody from "@/components/modal/series/NavBody";

vi.mock("@/components/modal/components/NavItem", () => ({
    __esModule: true,
    default: ({onClick, name}: any) => <button data-testid="card-item" onClick={onClick}>{name}</button>,
}))

describe('NavBody', () => {
    test('series 렌더링', () => {
        const userId = 'user-id';
        const seriesInfo = [
            {
                _id: '1',
                user_id: userId,
                series_name: '시리즈1',
                series_description: '',
                post_list: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                _id: '2',
                user_id: userId,
                series_name: '시리즈2',
                series_description: '',
                post_list: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ]

        render(
            <NavBody seriesInfo={seriesInfo}
                     seriesId={null}
                     setSeriesId={() => null} />
        )

        const cardItems = screen.getAllByTestId('card-item');
        cardItems.forEach((cardItem, index) => {
            expect(cardItem).toHaveTextContent(seriesInfo[index].series_name);
        });
    })

    test('시리즈 변경 동작', () => {
        const setSeriesId = vi.fn();
        const userId = 'user-id';
        const seriesInfo = [
            {
                _id: '1',
                user_id: userId,
                series_name: '시리즈1',
                series_description: '',
                post_list: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                _id: '2',
                user_id: userId,
                series_name: '시리즈2',
                series_description: '',
                post_list: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ]

        render(
            <NavBody seriesInfo={seriesInfo}
                     seriesId={null}
                     setSeriesId={setSeriesId} />
        )

        fireEvent.click(screen.getByText('시리즈1'));
        expect(setSeriesId).toBeCalledWith('1')
    })
})
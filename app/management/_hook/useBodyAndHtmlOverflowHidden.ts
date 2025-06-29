import { useEffect } from "react";


/**
 * 모바일 브라우저에서 드래그 시에 발생하는 새로고침을 방지하기 위한 목적
 * html, body의 overflow에 hiddne을 주어서 해당 기능을 방지
 * useEffect의 클린업을 활용하여 해당 훜을 호출한 컴포넌트가 언마운트 될 시, 기존 스타일로 복구
 *
 * @param {boolean} enable - 기능 활성화 여부
 * @return {void} 이 hook은 값을 반환하지 않는다.
 */
export function useBodyAndHtmlOverflowHidden(enable: boolean) {
    useEffect(() => {
        const body = document.body;
        const html = document.documentElement;

        const originalBodyOverflow = body.style.overflow;
        const originalHtmlOverflow = html.style.overflow;

        if (enable) {
            body.style.overflow = 'hidden';
            html.style.overflow = 'hidden';
        } else {
            body.style.overflow = originalBodyOverflow || '';
            html.style.overflow = originalHtmlOverflow || '';
        }

        return () => {
            body.style.overflow = originalBodyOverflow || '';
            html.style.overflow = originalHtmlOverflow || '';
        };
    }, [enable]);
}

import { useEffect } from "react";

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

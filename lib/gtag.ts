export const GA_MEASUREMENT_ID = 'G-1MN8BNEWXZ'

// window.gtag 타입 선언
declare global {
    interface Window {
        gtag: (...args: any[]) => void
    }
}

export const pageview = (url: string) => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
    })
}

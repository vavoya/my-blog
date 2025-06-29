import '@testing-library/jest-dom';

global.IntersectionObserver = class implements IntersectionObserver {
    root: Element | null = null;
    rootMargin: string = '';
    thresholds: ReadonlyArray<number> = [];

    constructor(public callback: IntersectionObserverCallback, public options?: IntersectionObserverInit) {}

    disconnect(): void {}
    observe(): void {}
    unobserve(): void {}
    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }
};

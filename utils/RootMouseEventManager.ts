
type MouseEventType = "click" | "mousedown" | "mouseup";
export type Callback = (e: MouseEvent) => void;

class RootMouseEventManager {
    private callbacksMap: Record<MouseEventType, Set<Callback>> = {
        click: new Set(),
        mousedown: new Set(),
        mouseup: new Set(),
    };

    constructor() {
        document.addEventListener("click", this.handle("click"));
        document.addEventListener("mousedown", this.handle("mousedown"));
        document.addEventListener("mouseup", this.handle("mouseup"));
    };

    private handle = (type: MouseEventType) => (event: MouseEvent) => {
        this.callbacksMap[type].forEach(cb => cb(event));
    };

    subscribe(type: MouseEventType, cb: Callback) {
        this.callbacksMap[type].add(cb);
    };

    unsubscribe(type: MouseEventType, cb: Callback) {
        this.callbacksMap[type].delete(cb);
    };
}

// 싱글톤 인스턴스 저장소
let instance: RootMouseEventManager | null = null;

export function getRootMouseEventManager(): RootMouseEventManager {
    if (typeof document === "undefined") {
        throw new Error("getRootMouseEventManager must be called in the browser");
    }

    if (!instance) {
        instance = new RootMouseEventManager();
    }

    return instance;
}

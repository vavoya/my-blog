type MouseEventType = "click" | "mousedown" | "mouseup";
export type Callback = (e: MouseEvent) => void;

/**
 * 루트(document)에 바인딩된 마우스 이벤트를 관리하는 클래스입니다.
 *
 * 각 이벤트 타입마다 콜백을 등록/해제할 수 있으며,
 * 이벤트가 발생하면 해당 타입에 등록된 모든 콜백이 호출됩니다.
 *
 * 내부적으로 싱글톤 인스턴스를 통해 전역 공유됩니다.
 */
class RootMouseEventManager {
    /**
     * 각 마우스 이벤트 타입별로 콜백 Set을 저장합니다.
     * 같은 콜백이 중복 등록되지 않도록 Set으로 관리됩니다.
     */
    private callbacksMap: Record<MouseEventType, Set<Callback>> = {
        click: new Set(),
        mousedown: new Set(),
        mouseup: new Set(),
    };

    /**
     * 생성자: document 루트에 마우스 이벤트 리스너를 등록합니다.
     * 각 타입별로 handle 메서드를 통해 콜백이 연결됩니다.
     */
    constructor() {
        document.addEventListener("click", this.handle("click"));
        document.addEventListener("mousedown", this.handle("mousedown"));
        document.addEventListener("mouseup", this.handle("mouseup"));
    };

    /**
     * 주어진 이벤트 타입에 대해 발생 시 호출할 핸들러를 생성합니다.
     * 내부적으로 등록된 모든 콜백을 순회하며 호출합니다.
     *
     * @param type 처리할 마우스 이벤트 타입
     * @returns 이벤트 발생 시 실행할 콜백 함수
     */
    private handle = (type: MouseEventType) => (event: MouseEvent) => {
        this.callbacksMap[type].forEach(cb => cb(event));
    };

    /**
     * 특정 마우스 이벤트 타입에 콜백을 등록합니다.
     * 동일 콜백이 중복 등록되지 않으며, 이벤트가 발생하면 실행됩니다.
     *
     * @param type 이벤트 타입 (click, mousedown, mouseup)
     * @param cb 등록할 콜백 함수
     */
    subscribe(type: MouseEventType, cb: Callback) {
        this.callbacksMap[type].add(cb);
    };

    /**
     * 특정 마우스 이벤트 타입에서 콜백을 제거합니다.
     * 등록되어 있던 콜백만 제거됩니다.
     *
     * @param type 이벤트 타입
     * @param cb 제거할 콜백 함수
     */
    unsubscribe(type: MouseEventType, cb: Callback) {
        this.callbacksMap[type].delete(cb);
    };
}

// 싱글톤 인스턴스 저장소
let instance: RootMouseEventManager | null = null;

/**
 * RootMouseEventManager 싱글톤 인스턴스를 반환합니다.
 *
 * 서버 사이드 환경에서는 사용이 불가능하며,
 * 브라우저 환경에서 최초 호출 시 인스턴스를 생성하고, 이후엔 동일 인스턴스를 재사용합니다.
 *
 * @throws 브라우저 환경이 아닌 경우 (document가 undefined인 경우)
 * @returns RootMouseEventManager 싱글톤 인스턴스
 */
export function getRootMouseEventManager(): RootMouseEventManager {
    if (typeof document === "undefined") {
        throw new Error("getRootMouseEventManager must be called in the browser");
    }

    if (!instance) {
        instance = new RootMouseEventManager();
    }

    return instance;
}

/**
 * @description 이전 값의 타입
 */
type PrevValue = string | null;

/**
 * @description 에러 결과 타입
 * @template E 에러 데이터의 타입
 */
type ErrorResult<E> = {
    status: "error";
    data: E
}

/**
 * @description 성공 결과 타입
 * @template T 성공 데이터의 타입
 */
type SuccessResult<T> = {
    status: "success"
    data: T,
    nextValue: PrevValue
}

/**
 * @description 비동기 작업의 결과 타입
 * @template T 성공 데이터의 타입
 * @template E 에러 데이터의 타입
 */
type AsyncTaskResult<T, E> = ErrorResult<E> | SuccessResult<T>;

/**
 * @description 비동기 작업을 수행하는 함수 타입
 * @template T 성공 데이터의 타입
 * @template E 에러 데이터의 타입
 */
type AsyncTask<T, E> = (prevValue: PrevValue) => Promise<AsyncTaskResult<T, E>>;

/**
 * @description 에러 발생 시 호출되는 콜백 함수 타입
 * @template E 에러 데이터의 타입
 */
type ErrorCallback<E> = (err: E) => string;

/**
 * @description 성공 시 호출되는 콜백 함수 타입
 * @template T 성공 데이터의 타입
 */
type SuccessCallback<T> = (data: T) => void;

/**
 * @description 비동기 작업 단위의 타입
 * @template T 성공 데이터의 타입
 * @template E 에러 데이터의 타입
 */
export type AsyncTaskUnit<T = any, E = any> = {
    name: string;
    content: string;
    time: Date;
    asyncTask: AsyncTask<T, E>;
    errorCallback: ErrorCallback<E>;
    successCallback: SuccessCallback<T>;
};

/**
 * @description 비동기 작업 단위에서 name, content, time만 선택한 타입
 */
export type CommitUnit = Pick<AsyncTaskUnit<unknown, unknown>, 'name' | 'content' | 'time'>

/**
 * @description 비동기 작업 상태를 관찰하는 옵저버 함수의 타입
 */
export type Observer = (info: {
    completedCount: number,
    recentCompleted: CommitUnit[],      // 최대 10개까지 완료 기록
    pending: CommitUnit[],              // 현재 대기 중 작업 전체 배열  
    isIdle: boolean,
    isError: boolean,
    errorMessage: string,
}) => void;

/**
 * @description 비동기 작업을 관리하는 클래스
 */
class AsyncTaskManager {
    private asyncTaskQueue = new Set<AsyncTaskUnit<any, any>>();
    private prevValue: PrevValue = null;
    private isIdle: boolean = true;
    private isError: boolean = false;
    private errorMessage: string = "";

    private recentCompleted: CommitUnit[] = [];
    private completedCount = 0;
    private observers = new Set<Observer>();

    constructor() {
    }

    /**
     * @description 옵저버 등록
     * @param observer 등록할 옵저버 함수
     */
    subscribe(observer: Observer) {
        this.observers.add(observer);
    }

    /**
     * @description 옵저버 해제
     * @param observer 해제할 옵저버 함수
     */
    unsubscribe(observer: Observer) {
        this.observers.delete(observer);
    }

    /**
     * @description 최근 완료된 작업 추가
     * @param unit 완료된 작업 단위
     */
    private addRecentCompleted(unit: CommitUnit) {
        this.recentCompleted.push(unit);
        if (this.recentCompleted.length > 10) {
            this.recentCompleted.shift();
        }
    }

    /**
     * @description 비동기 작업 추가
     * @template T 성공 데이터의 타입
     * @template E 에러 데이터의 타입
     */
    addAsyncTask<T, E>({
                           name,
                           content,
                           time,
                           asyncTask,
                           errorCallback,
                           successCallback,
                       }: AsyncTaskUnit<T, E>) {
        // 작업 큐에 추가
        this.asyncTaskQueue.add({
            name,
            content,
            time,
            asyncTask,
            errorCallback,
            successCallback,
        })
        // 추가 되면 알리기
        this.notify();

        // 에러 상태로 인한 아이들
        if (this.isIdle && this.isError) {
            return false;
        }
        // 모든 작업이 끝나고 아이들 -> 작업 재개
        if (this.isIdle) {
            this.runAsyncTask();
            return true;
        }
        // 작업 중 -> 그냥 작업
        if (!this.isIdle) {
            return true;
        }
    }

    /**
     * @description 비동기 작업 실행
     */
    private async runAsyncTask() {
        for (const asyncTaskUnit of this.asyncTaskQueue) {
            this.isIdle = false;
            this.notify();

            const {asyncTask, errorCallback, successCallback} = asyncTaskUnit;

            const result = await asyncTask(this.prevValue);

            if (result.status === "success") {
                this.prevValue = result.nextValue
                this.asyncTaskQueue.delete(asyncTaskUnit);
                this.addRecentCompleted(asyncTaskUnit);
                this.completedCount += 1;
                successCallback(result.data);
                this.notify();
            } else {
                this.isError = true;
                this.isIdle = true;
                this.errorMessage = errorCallback(result.data);
                this.notify();
                // 에러 나면 멈추기
                break;
            }
        }
        this.isIdle = true;
        this.notify();
    }

    /**
     * @description 비동기 작업 큐 초기화
     */
    clearAsyncTask() {
        this.asyncTaskQueue.clear();
    }

    /**
     * @description 옵저버들에게 상태 변경 알림
     */
    private notify() {
        const info = {
            completedCount: this.completedCount,
            recentCompleted: [...this.recentCompleted],
            pending: [...this.asyncTaskQueue].map(task => ({
                name: task.name,
                content: task.content,
                time: task.time,
            })),
            isIdle: this.isIdle,
            isError: this.isError,
            errorMessage: this.errorMessage,
        };
        this.observers.forEach(cb => cb(info));
    }
}


const instanceMap: Map<string, AsyncTaskManager> = new Map();

/**
 * @description AsyncTaskManager 인스턴스를 가져오는 함수
 * @param id 인스턴스의 식별자
 */
export function getAsyncTaskManager(id: string): AsyncTaskManager {
    if (typeof document === "undefined") {
        throw new Error("getAsyncTaskManager must be called in the browser");
    }

    if (!instanceMap.has(id)) {
        instanceMap.set(id, new AsyncTaskManager());
    }

    // 타입 단언 필요 (타입스크립트 한계, 런타임에 TError 일치 강제 불가)
    return instanceMap.get(id)!;
}

/**
 * @description AsyncTaskUnit의 타입을 보장하는 유틸리티 함수
 * @template T 성공 데이터의 타입
 * @template E 에러 데이터의 타입
 */
export function typedAsyncTaskUnit<T, E>(params: AsyncTaskUnit<T, E>): AsyncTaskUnit<T, E> {
    return params
}
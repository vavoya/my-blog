type PrevValue = string | null;
type ErrorResult<E> = {
    status: "error";
    data: E
}
type SuccessResult<T> = {
    status: "success"
    data: T,
    nextValue: PrevValue
}
type AsyncTaskResult<T, E> = ErrorResult<E> | SuccessResult<T>;

type AsyncTask<T, E> = (prevValue: PrevValue) => Promise<AsyncTaskResult<T, E>>;
type ErrorCallback<E> = (err: E) => string;
type SuccessCallback<T> = (data: T) => void;

export type AsyncTaskUnit<T = any, E = any> = {
    name: string;
    content: string;
    time: Date;
    asyncTask: AsyncTask<T, E>;
    errorCallback: ErrorCallback<E>;
    successCallback: SuccessCallback<T>;
};

export type CommitUnit = Pick<AsyncTaskUnit<unknown, unknown>, 'name' | 'content' | 'time'>

export type Observer = (info: {
    completedCount: number,
    recentCompleted: CommitUnit[],      // 최대 10개까지 완료 기록
    pending: CommitUnit[],              // 현재 대기 중 작업 전체 배열
    isIdle: boolean,
    isError: boolean,
    errorMessage: string,
}) => void;

class AsyncTaskManager {
    private asyncTaskQueue = new Set<AsyncTaskUnit<any, any>>();
    private prevValue: PrevValue = null;
    private isIdle: boolean = true;
    private isError: boolean = false;
    private errorMessage: string = "";

    private recentCompleted: CommitUnit[] = [];
    private completedCount = 0;
    private observers = new Set<Observer>();

    constructor() {}

    // 구독 등록
    subscribe(observer: Observer) {
        this.observers.add(observer);
    }

    // 구독 해제
    unsubscribe(observer: Observer) {
        this.observers.delete(observer);
    }

    private addRecentCompleted(unit: CommitUnit) {
        this.recentCompleted.push(unit);
        if (this.recentCompleted.length > 10) {
            this.recentCompleted.shift();
        }
    }

    addAsyncTask<T, E>({
        name,
        content,
        time,
        asyncTask,
        errorCallback,
        successCallback,
    }: AsyncTaskUnit<T, E>) {
        this.asyncTaskQueue.add({
            name,
            content,
            time,
            asyncTask,
            errorCallback,
            successCallback,
        })
        this.notify();

        if (this.isIdle && this.isError) {
            return false;
        }
        if (this.isIdle) {
            this.runAsyncTask();
            return true;
        }
        if (!this.isIdle) {
            return true;
        }
    }

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

    clearAsyncTask() {
        this.asyncTaskQueue.clear();
    }

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


export function typedAsyncTaskUnit<T, E>(params: AsyncTaskUnit<T, E>): AsyncTaskUnit<T, E>  {
    return params
}
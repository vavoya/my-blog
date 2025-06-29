/**
 * 작업을 수행할 함수 타입
 */
type Task = () => void;

/**
 * 애니메이션 프레임 ID 타입
 */
type Id = number | null;

/**
 * 프레임 단위로 작업을 실행하는 스케줄러 클래스
 */
class FrameScheduler {
    /** 실행할 작업들을 저장하는 큐 */
    #taskQueue = new Set<Task>();

    /** 현재 실행 중인 애니메이션 프레임의 ID */
    #id: Id = null;

    constructor() {
    }

    /**
     * 큐에 있는 모든 작업을 실행하는 메서드
     */
    runTask = () => {
        const taskQueue = this.#taskQueue;
        taskQueue.forEach((task) => task());
        this.startFrameLoop()
    }

    /**
     * 프레임 루프를 시작하는 메서드
     */
    startFrameLoop() {
        this.#id = requestAnimationFrame(this.runTask);
    }

    /**
     * 프레임 루프를 종료하는 메서드
     */
    endFrameLoop() {
        if (this.#id) {
            cancelAnimationFrame(this.#id);
        }
    }

    /**
     * 새로운 작업을 큐에 추가하는 메서드
     * @param task 추가할 작업
     */
    addTask(task: Task) {
        this.#taskQueue.add(task);
    }

    /**
     * 큐에서 작업을 제거하는 메서드
     * @param task 제거할 작업
     */
    removeTask(task: Task) {
        this.#taskQueue.delete(task);
    }
}

const frameScheduler = new FrameScheduler();
export default frameScheduler;
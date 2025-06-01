type Task = () => void;
type Id = number | null;

class FrameScheduler {
    #taskQueue = new Set<Task>();
    #id: Id = null;

    constructor() {}

    runTask = () => {
        const taskQueue = this.#taskQueue;
        taskQueue.forEach((task) => task());
        this.startFrameLoop()
    }

    startFrameLoop() {
        this.#id = requestAnimationFrame(this.runTask);
    }

    endFrameLoop() {
        if (this.#id) {
            cancelAnimationFrame(this.#id);
        }
    }

    addTask(task: Task) {
        this.#taskQueue.add(task);
    }

    removeTask(task: Task) {
        this.#taskQueue.delete(task);
    }
}

const frameScheduler = new FrameScheduler();
export default frameScheduler;

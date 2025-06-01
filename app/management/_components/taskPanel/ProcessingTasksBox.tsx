
import {TaskState} from "@/app/management/_components/taskPanel/TaskPanel";
import styles from "./taskBox.module.scss";

type ProcessingTasksBoxProps = {
    taskState: TaskState;
}
export default function ProcessingTasksBox({ taskState }: ProcessingTasksBoxProps) {
    const refresh = () => {
        window.location.reload()
    };

    if (!taskState || (taskState.isIdle && !taskState.isError)) {
        // 작업 없음

        return (
            <div className={styles.box}>
                <span className={styles.defaultTitle}>진행 중 인 작업이 없습니다</span>
            </div>
        )
    }
    else if (taskState.isError) {
        // 에러 발생
        return (
            <div className={styles.box}>
                <span className={styles.errorTitle}>문제가 발생했습니다</span>
                <span className={styles.content}>작업 유형: {taskState.pending[0].name}</span>
                <span className={styles.content}>작업 내용: {taskState.pending[0].content}</span>
                <span className={styles.content}>문제 내용: {taskState.errorMessage}</span>
                <button className={styles.errorButton} onClick={refresh}>
                    <span className={styles.buttonText}>새로고침</span>
                </button>
            </div>
        )
    } else {
        // 작업 중
        return (
            <div className={styles.box}>
                <span className={styles.defaultTitle}>작업 중 입니다</span>
                <span className={styles.content}>작업 유형: {taskState.pending[0].name}</span>
                <span className={styles.content}>작업 내용: {taskState.pending[0].content}</span>
            </div>
        )
    }
}
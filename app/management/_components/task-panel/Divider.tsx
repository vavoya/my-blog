import {TaskState} from "@/app/management/_components/task-panel/TaskPanel";
import styles from "./divider.module.css"

type DividerProps = {
    taskState: TaskState
}
export default function Divider({taskState}: DividerProps) {

    if (taskState && taskState.pending.length > 1) {
        return <div className={styles.divider} />
    } else {
        return null
    }
}
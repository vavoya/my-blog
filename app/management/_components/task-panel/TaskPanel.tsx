
import useAsyncTaskManager from "@/hook/useAsyncTaskManager";
import {useEffect, useState} from "react";
import {Observer} from "@/lib/AsyncTaskManager";
import ProcessingTasksBox from "@/app/management/_components/task-panel/ProcessingTasksBox";
import PendingTasksBox from "@/app/management/_components/task-panel/PendingTaskBox";
import styles from "./TaskPanel.module.scss"
import Divider from "@/app/management/_components/task-panel/Divider";

export type TaskState = Parameters<Observer>[number] | null;
export default function TaskPanel() {
    const asyncTaskManager = useAsyncTaskManager();
    const [ taskState, setTaskState ] = useState<TaskState>(null)

    useEffect(() => {
        const callback: Observer = (info) => {
            setTaskState(info)
        }

        asyncTaskManager.subscribe(callback);

        return () => {
            asyncTaskManager.unsubscribe(callback)
        }
    }, [asyncTaskManager]);


    return (
        <div className={styles.panel}>
            <PendingTasksBox taskState={taskState} />
            <Divider taskState={taskState} />
            <ProcessingTasksBox taskState={taskState}/>
        </div>
    )
}

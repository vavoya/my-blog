import {useEffect, useRef, useState} from "react";
import {TaskState} from "@/app/management/_components/taskPanel/TaskPanel";
import styles from "./taskBox.module.scss"

type PendingTasksBoxProps = {
    taskState: TaskState
}
export default function PendingTasksBox({ taskState }: PendingTasksBoxProps) {
    const boxRef = useRef<HTMLDivElement>(null)
    const pendingCount = taskState ? taskState.pending.length - 1 : 0;


    const [ height, setHeight ] = useState(0);

    useEffect(() => {
        if (!boxRef.current) return;

        if (pendingCount > 0) {
            const height = boxRef.current.offsetHeight;
            setHeight(height);
        } else {
            setHeight(0);
        }
    }, [pendingCount]);


    return (
        <div className={styles.animationWrapper} style={{height}}>
            <div ref={boxRef} className={styles.box}>
                <span className={styles.title}>대기 중인 작업 개수: {pendingCount}</span>
                <button className={styles.button}>
                    <span className={styles.content}>더보기</span>
                </button>
            </div>
        </div>
    )
}
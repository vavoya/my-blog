import {MouseEventHandler, RefObject} from "react";
import styles from "./modal.module.scss"


type RemoveModalProps = {
    ref: RefObject<HTMLDivElement | null>;
    name: string;
    deleteFolder: MouseEventHandler;
    cancel: MouseEventHandler;
}
export default function RemoveModal({ref, name, cancel, deleteFolder} : RemoveModalProps) {


    return (
        <div className={styles.modal} ref={ref}>
            <div className={styles.modalContentBox}>
                <h3 className={styles.modalHeader}>
                    [{name}] 폴더 삭제
                </h3>
                <span className={styles.modalText}>
                    폴더 삭제 시, 하위 폴더 및 포스트는 상위 폴더로 이동합니다.
                </span>
            </div>
            <div className={styles.modalButtons}>
                <button tabIndex={0} className={`${styles.modalButton} ${styles.cancel}`} onClick={cancel}>
                    취소
                </button>
                <button tabIndex={0} className={`${styles.modalButton} ${styles.primary}`} onClick={deleteFolder}>
                    삭제
                </button>
            </div>
        </div>
    )
}
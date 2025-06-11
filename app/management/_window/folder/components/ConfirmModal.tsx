import {MouseEventHandler, RefObject} from "react";
import styles from "./modal.module.scss"


type RemoveModalProps = {
    ref: RefObject<HTMLDivElement | null>;
    modalTitle: string;
    modalText: string[];
    secondary: {
        onClick: MouseEventHandler,
        text: string;
    },
    primary: {
        onClick: MouseEventHandler,
        text: string;
    }
}
export default function ConfirmModal({ref, modalTitle, modalText, secondary, primary} : RemoveModalProps) {


    return (
        <div className={styles.modal} ref={ref}>
            <div className={styles.modalContentBox}>
                <h3 className={styles.modalHeader}>
                    {modalTitle}
                </h3>
                <div>
                    {
                        modalText.map((text, index) => (
                            <span key={index} className={styles.modalText}>
                                {text}
                                <br/>
                            </span>
                        ))
                    }
                </div>
            </div>
            <div className={styles.modalButtons}>
                <button tabIndex={0} className={`${styles.modalButton} ${styles.cancel}`} onClick={secondary.onClick}>
                    {secondary.text}
                </button>
                <button tabIndex={0} className={`${styles.modalButton} ${styles.primary}`} onClick={primary.onClick}>
                    {primary.text}
                </button>
            </div>
        </div>
    )
}
import {MouseEventHandler, RefObject, useState} from "react";
import styles from "./modal.module.scss"
import {FOLDER_NAME_LIMIT} from "@/const/folder";
import {AddFolder} from "@/app/management/_window/folder/FolderWindow";


type AddFolderModalProps = {
    ref: RefObject<HTMLDivElement | null>;
    name: string;
    addFolder: AddFolder;
    cancel: MouseEventHandler;
}
export default function AddFolderModal({ref, name, cancel, addFolder} : AddFolderModalProps) {
    const [childName, setChildName] = useState("")

    return (
        <div className={styles.modal} ref={ref}>
            <div className={styles.modalContentBox}>
                <h3 className={styles.modalHeader}>
                    [{name}] 하위 폴더 생성
                </h3>
                <label className="sr-only" htmlFor="folder-name">폴더 이름</label>
                <input id="folder-name"
                       tabIndex={0}
                       className={styles.modalText}
                       maxLength={FOLDER_NAME_LIMIT}
                       placeholder={"새 폴더"} onChange={e => {
                           setChildName(e.target.value);
                       }}/>
            </div>
            <div className={styles.modalButtons}>
                <button tabIndex={0} className={`${styles.modalButton} ${styles.cancel}`} onClick={cancel}>
                    취소
                </button>
                <button tabIndex={0} disabled={!childName} className={`${styles.modalButton} ${styles.primary}`} onClick={() => addFolder(childName)}>
                    생성
                </button>
            </div>
        </div>
    )
}
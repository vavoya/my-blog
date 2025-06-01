import {MouseEventHandler, RefObject, useState} from "react";
import styles from "./modal.module.scss"
import {FOLDER_NAME_LIMIT} from "@/const/folder";
import {RenameFolder} from "@/app/management/_window/folder/FolderWindow";


type NameChangeModalProps = {
    ref: RefObject<HTMLDivElement | null>;
    name: string;
    renameFolder: RenameFolder;
    cancel: MouseEventHandler;
}
export default function NameChangeModal({ref, name, cancel, renameFolder} : NameChangeModalProps) {
    const [ newName, setNewName ] = useState("");

    return (
        <div className={styles.modal} ref={ref}>
            <div className={styles.modalContentBox}>
                <h3 className={styles.modalHeader}>
                    [{name}] 폴더 이름 변경
                </h3>
                <label className="sr-only" htmlFor="folder-name">폴더 이름</label>
                <input id="folder-name"
                       tabIndex={0}
                       className={styles.modalText}
                       maxLength={FOLDER_NAME_LIMIT}
                       placeholder={name} onChange={e => {
                           setNewName(e.target.value);
                       }}/>
            </div>
            <div className={styles.modalButtons}>
                <button tabIndex={0} className={`${styles.modalButton} ${styles.cancel}`} onClick={cancel}>
                    취소
                </button>
                <button tabIndex={0} disabled={!newName} className={`${styles.modalButton} ${styles.primary}`} onClick={() => newName ? renameFolder(newName) : null}>
                    저장
                </button>
            </div>
        </div>
    )
}
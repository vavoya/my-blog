import {CSSProperties, MouseEventHandler, RefObject} from "react";
import styles from "./folderOptionModal.module.scss"


type FolderOptionModalProps = {
    ref: RefObject<HTMLDivElement | null>;
    x: number;
    y: number;
    renameFolder: MouseEventHandler;
    deleteFolder: MouseEventHandler;
    moveFolder: MouseEventHandler;
    addFolder: MouseEventHandler;
    isRoot?: boolean;
}
export default function FolderOptionModal({ref, x, y, renameFolder, deleteFolder, moveFolder, addFolder, isRoot = false}: FolderOptionModalProps) {

    const layout: CSSProperties = {
        position: 'absolute',
        top: y,
        left: x,
    }

    return (
        <div ref={ref} className={styles.modal} style={layout}>
            <div className={styles.buttons}>
                {
                    !isRoot && (
                        <>
                            <button tabIndex={0} className={styles.button} onClick={renameFolder}>
                                <span>폴더 이름 변경</span>
                            </button>
                            <button tabIndex={0} className={styles.button} onClick={deleteFolder}>
                                <span>폴더 삭제</span>
                            </button>
                            <button tabIndex={0} className={styles.button} onClick={moveFolder}>
                                <span>폴더 이동</span>
                            </button>
                        </>
                    )
                }
                <button tabIndex={0} className={styles.button} onClick={addFolder}>
                    <span>하위 폴더 생성</span>
                </button>
            </div>
        </div>

    )
}
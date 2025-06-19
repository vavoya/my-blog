import {MouseEventHandler, RefObject, useState} from "react";
import styles from "./modal.module.scss"
import moveModalStyles from "./moveModal.module.scss"
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {FolderObj} from "@/components/modal/utils/toObj";
import {useManagementStore} from "@/store/ManagementProvider";
import SearchFolder, {SelectFolder} from "@/app/management/_components/search-folder/SearchFolder";
import {MoveFolder} from "@/app/management/_window/folder/FolderWindow";

type MoveModalProps = {
    ref: RefObject<HTMLDivElement | null>;
    name: string;
    folderObj: FolderObj;
    moveFolder: MoveFolder;
    cancel: MouseEventHandler;
}
export default function MoveModal({ref, name, folderObj, cancel, moveFolder} : MoveModalProps) {
    const [ selectedFolder, setSelectedFolder ] = useState<FolderInfoResponse>();
    const trie = useManagementStore((state) => state.trie);


    const selectFolder: SelectFolder = (folder) => {
        setSelectedFolder(folder);
    }

    return (
        <div className={styles.modal} ref={ref}>
            <div className={styles.modalContentBox}>
                <h3 className={styles.modalHeader}>
                    [{name}] 폴더 이동
                </h3>
                <SearchFolder selectFolder={selectFolder}
                              folderObj={folderObj}
                              trie={trie}
                              classNames={{
                                  input: styles.modalText,
                                  listBoxRoot: moveModalStyles.listBoxRoot,
                                  listBox: moveModalStyles.listBox,
                                  list: moveModalStyles.list,
                                  text: styles.modalText,
                              }}/>
            </div>
            <div className={styles.modalButtons}>
                <button tabIndex={0} className={`${styles.modalButton} ${styles.cancel}`} onClick={cancel}>
                    취소
                </button>
                <button tabIndex={0} disabled={!selectedFolder} className={`${styles.modalButton} ${styles.primary}`} onClick={() => selectedFolder ? moveFolder(selectedFolder._id) : null}>
                    이동
                </button>
            </div>
        </div>
    )
}
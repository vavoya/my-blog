import {FolderObj} from "@/components/modal/utils/toObj";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {FolderChildrenMap} from "@/app/management/_utils/buildFolderChildrenMap";
import {OpenFolder, OpenOption} from "@/app/management/_window/folder/FolderWindow";
import SvgFolder from "@/components/svg/Folder";
import styles from "./treeBranch.module.scss"


type SubtreeProps = {
    folderObj: FolderObj;
    folderChildrenMap: FolderChildrenMap;
    folderId: FolderInfoResponse['_id'];
    openOption: OpenOption;
    openFolder: OpenFolder;
}
export default function TreeBranch({folderObj, folderChildrenMap, folderId, openOption, openFolder}: SubtreeProps) {
    const folder = folderObj[folderId];
    const folderChildren = folderChildrenMap[folderId];

    return (
        <div className={styles.treeBranch}>
            <div className={styles.folder}>
                <button tabIndex={0}
                        className={styles.folderInfo}
                        onClick={(e) => openFolder(e, folderId)}>
                    <SvgFolder width={20} />
                    <span className={styles.folderName}>{folder.folder_name}</span>
                    <span className={styles.postCount}>{folder.post_count}</span>
                </button>
                <button tabIndex={0}
                        className={styles.folderOptionButton}
                        onClick={e => openOption(e, folderId)}>
                    ⋮
                </button>
            </div>
            {
                folderChildren && (
                    <div className={styles.children}>
                        {[...folderChildren].map((childId) => <TreeBranch key={childId} folderObj={folderObj} folderChildrenMap={folderChildrenMap} folderId={childId} openOption={openOption} openFolder={openFolder} />)}
                    </div>
                )
            }
        </div>
    )
}
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {FolderObj} from "@/components/modal/utils/toObj";

// 폴더 ID 기준으로 자식 폴더 ID들을 가진 구조
export type FolderChildrenMap = {
    [folderId: FolderInfoResponse['_id']]: Set<FolderInfoResponse['_id']>;
};

/**
 * folderObj 를 pfolder_id를 key로 하고, 하위 자식들의 id를 value로 가진 객체를 반환
 *
 * @param {FolderObj} folderObj - 자신의 id를 key, 자신을 value로 하는객체
 * @returns {FolderChildrenMap} folderObj 를 pfolder_id를 key로 하고, 하위 자식들의 id를 value로 가진 객체
 */
const buildFolderChildrenMap = (folderObj: FolderObj) => {
    return Object.values(folderObj).reduce((acc, folder) => {
        const folderId = folder._id;
        const parentId = folder.pfolder_id;

        if (parentId) {
            const children = acc[parentId];
            if (children) {
                children.add(folderId);
            } else {
                acc[parentId] = new Set([folderId]);
            }
        }

        return acc;
    }, {} as FolderChildrenMap);
};

export default buildFolderChildrenMap;
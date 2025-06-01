import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {FolderObj} from "@/components/modal/utils/toObj";

// 폴더 ID 기준으로 자식 폴더 ID들을 가진 구조
export type FolderChildrenMap = {
    [folderId: FolderInfoResponse['_id']]: Set<FolderInfoResponse['_id']>;
};

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
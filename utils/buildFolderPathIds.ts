import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {FolderObj} from "@/components/modal/utils/toObj";

export const buildFolderPathIds = (initFolderId: FolderInfoResponse['_id'], folderObj: FolderObj) => {
    const reverseFolderPath = [initFolderId];

    let folderId = folderObj[initFolderId].pfolder_id;

    while (folderId) {
        reverseFolderPath.push(folderId);
        folderId = folderObj[folderId].pfolder_id;
    }

    return reverseFolderPath.reverse();
}
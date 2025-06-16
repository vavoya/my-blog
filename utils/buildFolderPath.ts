import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {buildFolderPathIds} from "@/utils/buildFolderPathIds";
import {FolderObj} from "@/components/modal/utils/toObj";

export function buildFolderPath (folder: FolderInfoResponse, folderObj: FolderObj) {
    return buildFolderPathIds(folder._id, folderObj).map(id => folderObj[id].folder_name).join('/');
}

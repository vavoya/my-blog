import {folderInfoResponseShape} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";

export type PostInput = {
    userId: FolderInfoResponse["user_id"];
    pFolderId: FolderInfoResponse["_id"];
    folderName: FolderInfoResponse["folder_name"];
}
export const postInputShape: PostInput = {
    userId: folderInfoResponseShape["user_id"],
    pFolderId: folderInfoResponseShape["_id"],
    folderName: folderInfoResponseShape["folder_name"],
}
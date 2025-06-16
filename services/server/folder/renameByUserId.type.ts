import {folderInfoResponseShape} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";

export type RenameInput = {
    userId: FolderInfoResponse["user_id"];
    folderId: FolderInfoResponse["_id"];
    folderName: FolderInfoResponse["folder_name"];
}
export const renameInputShape: RenameInput = {
    userId: folderInfoResponseShape["user_id"],
    folderId: folderInfoResponseShape["_id"],
    folderName: folderInfoResponseShape["folder_name"],
}
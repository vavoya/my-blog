import {folderInfoResponseShape} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";

export type MoveInput = {
    userId: FolderInfoResponse["user_id"];
    folderId: FolderInfoResponse["_id"];
    pFolderId: FolderInfoResponse["_id"];
}
export const moveInputShape: MoveInput = {
    userId: folderInfoResponseShape["user_id"],
    folderId: folderInfoResponseShape["_id"],
    pFolderId: folderInfoResponseShape["_id"],
}
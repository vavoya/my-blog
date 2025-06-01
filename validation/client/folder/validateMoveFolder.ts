import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";


type ValidateMoveFolder = (pFolderId: FolderInfoResponse["_id"]) => {
    isValid: true;
} | {
    isValid: false;
    type: "pFolderId";
};
export const validateMoveFolder: ValidateMoveFolder = (pFolderId) => {
    if (pFolderId === "") {
        return {
            isValid: false,
            type: "pFolderId",
        }
    }
    return {
        isValid: true,
    }
}
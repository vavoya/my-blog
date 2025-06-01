import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";


type ValidateFolder = (name: FolderInfoResponse["folder_name"], pFolderId: FolderInfoResponse["_id"]) => {
    isValid: true;
} | {
    isValid: false;
    type: "name";
} | {
    isValid: false;
    type: "pFolderId";
};
export const validateFolder: ValidateFolder = (name, pFolderId) => {
    if (name === "") {
        return {
            isValid: false,
            type: "name",
        }
    }
    if (pFolderId === "") {
        return {
            isValid: true,
            type: "pFolderId",
        }
    }
    return {
        isValid: true,
    }
}
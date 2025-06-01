import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";


type ValidateRenameFolder = (name: FolderInfoResponse['folder_name']) => {
    isValid: true;
} | {
    isValid: false;
    type: "name";
};
export const validateRenameFolder: ValidateRenameFolder = (name) => {
    if (name === "") {
        return {
            isValid: false,
            type: "name",
        }
    }
    return {
        isValid: true,
    }
}
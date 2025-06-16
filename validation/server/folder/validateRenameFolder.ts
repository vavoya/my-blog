import {isShape} from "@/utils/isShape";
import {renameInputShape, RenameInput} from "@/services/server/folder/renameByUserId.type";


export function validateRenameFolder(body: any): body is RenameInput {
    if (!isShape(body, renameInputShape)) {
        return false
    }

    return !(body.folderName === "");
}
import {isShape} from "@/utils/isShape";
import {renameInputShape, RenameInput} from "@/services/server/folder/renameByUserId/type";


type ValidateRenameFolder = (body: any) => body is RenameInput
export const validateRenameFolder: ValidateRenameFolder = (body): body is RenameInput => {
    if (!isShape(body, renameInputShape)) {
        return false
    }

    return !(body.folderName === "");
}
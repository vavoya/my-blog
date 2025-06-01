import {isShape} from "@/utils/isShape";
import {postInputShape, PostInput} from "@/services/server/folder/postByUserId/type";


type ValidateFolder = (body: any) => body is PostInput
export const validateFolder: ValidateFolder = (body): body is PostInput => {
    if (!isShape(body, postInputShape)) {
        return false
    }

    return !(body.pFolderId === "" || body.folderName === "");
}
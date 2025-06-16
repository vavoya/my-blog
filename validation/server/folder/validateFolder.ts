import {isShape} from "@/utils/isShape";
import {postInputShape, PostInput} from "@/services/server/folder/postByUserId.type";


export function validateFolder(body: any): body is PostInput {
    if (!isShape(body, postInputShape)) {
        return false
    }

    return !(body.pFolderId === "" || body.folderName === "");
}
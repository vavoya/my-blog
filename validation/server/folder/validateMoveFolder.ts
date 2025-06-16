import {isShape} from "@/utils/isShape";
import {moveInputShape, MoveInput} from "@/services/server/folder/moveByUserId.type";

export function validateMoveFolder(body: any): body is MoveInput {
    if (!isShape(body, moveInputShape)) {
        return false
    }

    return !(body.pFolderId === "");
}

validateMoveFolder({})
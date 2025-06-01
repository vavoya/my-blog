import {isShape} from "@/utils/isShape";
import {moveInputShape, MoveInput} from "@/services/server/folder/moveByUserId/type";


type ValidateMoveFolder = (body: any) => body is MoveInput
export const validateMoveFolder: ValidateMoveFolder = (body): body is MoveInput => {
    if (!isShape(body, moveInputShape)) {
        return false
    }

    return !(body.pFolderId === "");
}

validateMoveFolder({})
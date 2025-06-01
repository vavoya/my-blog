import {PatchInput, patchInputShape} from "@/services/server/post/patchByUserId/type";
import {isShape} from "@/utils/isShape";

type ValidatePost = (body: any) => body is PatchInput;
export const validateUpdatePost: ValidatePost = (body): body is PatchInput => {
    if (!isShape(body, patchInputShape)) {
        return false
    }

    return !((body.folderId === "") ||
        (body.postName === "") ||
        (body.postContent === ""));
}

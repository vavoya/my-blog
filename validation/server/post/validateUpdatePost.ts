import {PatchInput, patchInputShape} from "@/services/server/post/patchByUserId.type";
import {isShape} from "@/utils/isShape";

export function validateUpdatePost(body: any): body is PatchInput {
    if (!isShape(body, patchInputShape)) {
        return false
    }

    return !((body.folderId === "") ||
        (body.postName === "") ||
        (body.postContent === ""));
}

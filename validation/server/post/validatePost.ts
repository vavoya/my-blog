import {PostInput, postInputShape} from "@/services/server/post/postByUserId.type";
import {isShape} from "@/utils/isShape";

export function validatePost(body: any): body is PostInput {
    if (!isShape(body, postInputShape)) {
        return false
    }

    return !((body.folderId === "") ||
        (body.postName === "") ||
        (body.postContent === ""));
}

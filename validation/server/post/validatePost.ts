import {PostInput, postInputShape} from "@/services/server/post/postByUserId/type";
import {isShape} from "@/utils/isShape";

type ValidatePost = (body: any) => body is PostInput;
export const validatePost: ValidatePost = (body): body is PostInput => {
    if (!isShape(body, postInputShape)) {
        return false
    }

    return !((body.folderId === "") ||
        (body.postName === "") ||
        (body.postContent === ""));
}

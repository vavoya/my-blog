import {isShape} from "@/utils/isShape";
import {UpdateInput, updateInputShape} from "@/services/server/update-user/updateByUserId.type";

export function validateUpdateUser(body: any): body is UpdateInput {
    if (!isShape(body, updateInputShape)) {
        return false
    }

    return !((body.userId === "") ||
        (body.userName === "") ||
        (body.blogName === ""));
}

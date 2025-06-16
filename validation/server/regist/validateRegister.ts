import {CreateInput, createInputShape} from "@/services/server/registration/createByAuthId.type";
import {isShape} from "@/utils/isShape";

export function validateRegister(body: any): body is CreateInput {
    if (!isShape(body, createInputShape)) {
        return false
    }

    return !((body.blogUrl === "") ||
        (body.name === "") ||
        (body.blogName === ""));
}

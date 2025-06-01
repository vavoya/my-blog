import {CreateInput, createInputShape} from "@/services/server/registration/createByAuthId/type";
import {isShape} from "@/utils/isShape";

type ValidateRegister = (body: any) => body is CreateInput;
export const validateRegister: ValidateRegister = (body): body is CreateInput => {
    if (!isShape(body, createInputShape)) {
        return false
    }

    return !((body.blogUrl === "") ||
        (body.name === "") ||
        (body.blogName === ""));
}

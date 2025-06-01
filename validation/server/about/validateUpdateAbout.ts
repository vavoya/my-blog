import {isShape} from "@/utils/isShape";
import {PatchInput, patchInputShape} from "@/services/server/about/patchByUserId/type";

type ValidateAbout = (body: any) => body is PatchInput;
export const validateUpdateAbout: ValidateAbout = (body): body is PatchInput => {
    if (!isShape(body, patchInputShape)) {
        return false
    }

    return !(body.content === "");
}

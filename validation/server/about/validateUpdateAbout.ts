import {isShape} from "@/utils/isShape";
import {PatchInput, patchInputShape} from "@/services/server/about/patchByUserId.type";

export function validateUpdateAbout(body: any): body is PatchInput {
    if (!isShape(body, patchInputShape)) {
        return false
    }

    return !(body.content === "");
}

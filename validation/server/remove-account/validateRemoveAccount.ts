import {isShape} from "@/utils/isShape";
import {RemoveInput, removeInputShape} from "@/services/server/remove-account/removeByUserId.type";

export function validateRemoveAccount(body: any): body is RemoveInput {
    if (!isShape(body, removeInputShape)) {
        return false
    }

    return !(body.userId === "")
}

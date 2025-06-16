import {isShape} from "@/utils/isShape";
import {patchInputShape, PatchInput} from "@/services/server/series/patchByUserId.type";


export function validatePatchSeries(body: any): body is PatchInput{
    if (!isShape(body, patchInputShape)) {
        return false
    }

    return !(body.seriesName === "");
}
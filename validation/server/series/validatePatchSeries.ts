import {isShape} from "@/utils/isShape";
import {patchInputShape, PatchInput} from "@/services/server/series/patchByUserId/type";


type ValidatePatchSeries = (body: any) => body is PatchInput
export const validatePatchSeries: ValidatePatchSeries = (body): body is PatchInput => {
    if (!isShape(body, patchInputShape)) {
        return false
    }

    return !(body.seriesName === "");
}
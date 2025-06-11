import {isShape} from "@/utils/isShape";
import {postInputShape, PostInput} from "@/services/server/series/postByUserId/type";


type ValidateSeries = (body: any) => body is PostInput
export const validateSeries: ValidateSeries = (body): body is PostInput => {
    if (!isShape(body, postInputShape)) {
        return false
    }

    return !(body.seriesName === "");
}
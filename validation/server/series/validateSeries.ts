import {isShape} from "@/utils/isShape";
import {postInputShape, PostInput} from "@/services/server/series/postByUserId.type";


export function validateSeries(body: any): body is PostInput {
    if (!isShape(body, postInputShape)) {
        return false
    }

    return !(body.seriesName === "");
}
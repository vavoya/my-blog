import {SeriesInfoResponse, seriesInfoResponseShape} from "@/lib/mongoDB/types/documents/seriesInfo.type";

export type Type = {
    userId: SeriesInfoResponse["user_id"];
    seriesId: SeriesInfoResponse["_id"];
}
export const deleteInputShape: Type = {
    userId: seriesInfoResponseShape["user_id"],
    seriesId: seriesInfoResponseShape['_id'],
}
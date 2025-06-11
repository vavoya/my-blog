import {SeriesInfoResponse, seriesInfoResponseShape} from "@/lib/mongoDB/types/documents/seriesInfo.type";

export type PostInput = {
    userId: SeriesInfoResponse["user_id"];
    seriesName: SeriesInfoResponse["series_name"];
}
export const postInputShape: PostInput = {
    userId: seriesInfoResponseShape["user_id"],
    seriesName: seriesInfoResponseShape["series_name"],
}
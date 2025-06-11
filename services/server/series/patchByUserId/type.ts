import {SeriesInfoResponse, seriesInfoResponseShape} from "@/lib/mongoDB/types/documents/seriesInfo.type";

export type PatchInput = {
    userId: SeriesInfoResponse["user_id"];
    seriesId: SeriesInfoResponse["_id"];
    seriesName: SeriesInfoResponse["series_name"];
    seriesDescription: SeriesInfoResponse["series_description"];
    newPostList: SeriesInfoResponse['post_list'];
}
export const patchInputShape: PatchInput = {
    userId: seriesInfoResponseShape["user_id"],
    seriesId: seriesInfoResponseShape["_id"],
    seriesName: seriesInfoResponseShape["series_name"],
    seriesDescription: seriesInfoResponseShape['series_description'],
    newPostList: seriesInfoResponseShape['post_list'],
}
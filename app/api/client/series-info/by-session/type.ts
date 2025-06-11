import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Response} from "@/app/api/types";
import {PostInput} from "@/services/server/series/postByUserId/type";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";

export type ReqBodyType = PostInput & {lastModified: UserInfoResponse['last_modified']}
export type ResBodyType = Response<{
    seriesId: SeriesInfoResponse['_id'];
    createdAt: SeriesInfoResponse['createdAt'];
    updatedAt: SeriesInfoResponse['updatedAt'];
    lastModified: UserInfoResponse['last_modified']}>


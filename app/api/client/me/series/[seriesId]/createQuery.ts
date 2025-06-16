import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";
import {createSeriesQuery} from "@/app/api/client/me/series/createQuery";


function createSeriesIdQuery(postId: PostInfoResponse['_id']) {
    return `${createSeriesQuery()}/${postId}` as const
}

export {
    createSeriesIdQuery
}
import {PostInfoResponse, postInfoResponseShape} from "@/lib/mongoDB/types/documents/postInfo.type";

export type DeleteByUserIdType = {
    userId: PostInfoResponse["user_id"];
    postId: PostInfoResponse["_id"];
}
export const deleteInputShape: DeleteByUserIdType = {
    postId: postInfoResponseShape['_id'],
    userId: postInfoResponseShape["user_id"],
}
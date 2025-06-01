import {PostInfoResponse, postInfoResponseShape} from "@/lib/mongoDB/types/documents/postInfo.type";

export type Type = {
    userId: PostInfoResponse["user_id"];
    postId: PostInfoResponse["_id"];
    folderId: PostInfoResponse["folder_id"];
}
export const deleteInputShape: Type = {
    postId: postInfoResponseShape['_id'],
    userId: postInfoResponseShape["user_id"],
    folderId: postInfoResponseShape['folder_id'],
}
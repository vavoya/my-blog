import {PostInfoResponse, postInfoResponseShape} from "@/lib/mongoDB/types/documents/postInfo.type";

export type Type = {
    userId: PostInfoResponse["user_id"];
    folderId: PostInfoResponse["folder_id"];
}
export const deleteInputShape: Type = {
    userId: postInfoResponseShape["user_id"],
    folderId: postInfoResponseShape['folder_id'],
}
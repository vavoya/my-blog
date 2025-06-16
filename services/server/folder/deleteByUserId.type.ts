import {PostInfoResponse, postInfoResponseShape} from "@/lib/mongoDB/types/documents/postInfo.type";

export type DeleteByUserIdType = {
    userId: PostInfoResponse["user_id"];
    folderId: PostInfoResponse["folder_id"];
}
export const deleteInputShape: DeleteByUserIdType = {
    userId: postInfoResponseShape["user_id"],
    folderId: postInfoResponseShape['folder_id'],
}
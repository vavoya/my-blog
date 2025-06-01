import {PostInfoResponse, postInfoResponseShape} from "@/lib/mongoDB/types/documents/postInfo.type";

export type PatchInput = {
    _id: PostInfoResponse['_id'];
    userId: PostInfoResponse["user_id"]
    postName: PostInfoResponse['post_name'];
    postContent: PostInfoResponse['post_content'];
    thumbUrl: PostInfoResponse['thumb_url'];
    postDescription: PostInfoResponse['post_description'];
    folderId: PostInfoResponse['folder_id'];
}
export const patchInputShape: PatchInput = {
    _id: postInfoResponseShape['_id'],
    userId: postInfoResponseShape["user_id"],
    postName: postInfoResponseShape['post_name'],
    postContent: postInfoResponseShape['post_content'],
    thumbUrl: postInfoResponseShape['thumb_url'],
    postDescription: postInfoResponseShape['post_description'],
    folderId: postInfoResponseShape['folder_id'],
}
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";
import {createPostQuery} from "@/app/api/client/me/posts/createQuery";


function createPostIdQuery(postId: PostInfoResponse['_id']) {
    return `${createPostQuery()}/${postId}` as const
}

export {
    createPostIdQuery
}
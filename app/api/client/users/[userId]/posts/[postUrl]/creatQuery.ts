import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";
import {createUserIdQuery} from "@/app/api/client/users/[userId]/createQuery";

function createPostUrlQuery(userId: UserInfoResponse['_id'], postUrl: PostInfoResponse['post_url']) {
    return `${createUserIdQuery(userId)}/posts/${postUrl}`
}

export {
    createPostUrlQuery
}
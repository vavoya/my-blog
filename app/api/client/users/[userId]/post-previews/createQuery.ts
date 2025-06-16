import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {createUserIdQuery} from "@/app/api/client/users/[userId]/createQuery";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";


function createPostPreviewsQuery(
    userId: UserInfoResponse['_id'],
    postIds: PostInfoResponse['_id'][]
) {
    const base = `${createUserIdQuery(userId)}/post-previews`;
    if (!postIds.length) return base;

    const searchParams = new URLSearchParams();
    for (const id of postIds) {
        searchParams.append("id", id);
    }
    return `${base}?${searchParams.toString()}`;
}

export {
    createPostPreviewsQuery
}

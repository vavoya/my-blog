import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";
import {createFoldersQuery} from "@/app/api/server/users/[userId]/folders/createQuery";


function createPageNumberQuery(folderId: FolderInfoResponse['_id'], userId: UserInfoResponse['_id'], postId: PostInfoResponse['_id']) {
    return `${createFoldersQuery(userId)}/${folderId}/page-number?post-id=${postId}` as const
}
export {
    createPageNumberQuery
}
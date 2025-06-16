import {createUserIdQuery} from "@/app/api/server/users/[userId]/createQuery";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";

function createFoldersQuery(userId: UserInfoResponse['_id']) {
    return `${createUserIdQuery(userId)}/folders` as const
}

export {
    createFoldersQuery
}
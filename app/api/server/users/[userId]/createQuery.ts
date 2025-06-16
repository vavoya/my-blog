import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {createUserQuery} from "@/app/api/server/users/createQuery";


function createUserIdQuery(userId: UserInfoResponse['_id']) {
    return `${createUserQuery()}/${userId}` as const
}

export {
    createUserIdQuery
}
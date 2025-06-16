import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {createUserIdQuery} from "@/app/api/client/users/[userId]/createQuery";


function createAboutQuery(userId: UserInfoResponse['_id']) {
    return `${createUserIdQuery(userId)}/about` as const;
}

export {
    createAboutQuery
}
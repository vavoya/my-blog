import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {createUserIdQuery} from "@/app/api/server/users/[userId]/createQuery";

function createSeriesQuery(userId: UserInfoResponse['_id']) {
    return `${createUserIdQuery(userId)}/series` as const;
}

export {
    createSeriesQuery
}
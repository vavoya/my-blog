import {createUserQuery} from "@/app/api/client/users/createQuery";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";


function createUserIdQuery(userId: UserInfoResponse['_id']) {
    return `${createUserQuery()}/${userId}` as const;
}

export {
    createUserIdQuery
}
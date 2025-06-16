import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";

const path = '/api/server/banned-auth-list';
function createAuthIdQuery(authId: UserInfoResponse['auth_id']) {
    return `${process.env.NEXT_PUBLIC_BASE_URL}${path}?auth-id=${authId}` as const
}

export {
    createAuthIdQuery
}
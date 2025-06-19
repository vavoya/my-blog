import {UserInfoResponse, userInfoResponseShape,} from "@/lib/mongoDB/types/documents/userInfo.type";

export type UpdateInput = {
    userId: UserInfoResponse["_id"];
    userName: UserInfoResponse["user_name"];
    blogName: UserInfoResponse["blog_name"];
    agreementsEmail: UserInfoResponse["agreements"]["email"];
}
export const updateInputShape = {
    userId: userInfoResponseShape["_id"],
    userName: userInfoResponseShape["user_name"],
    blogName: userInfoResponseShape["blog_name"],
    agreementsEmail: userInfoResponseShape["agreements"].email,
}
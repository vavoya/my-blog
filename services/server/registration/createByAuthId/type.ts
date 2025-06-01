import {UserInfoResponse, userInfoResponseShape,} from "@/lib/mongoDB/types/documents/userInfo.type";

export type CreateInput = {
    name: UserInfoResponse["user_name"];
    blogName: UserInfoResponse["blog_name"];
    blogUrl: UserInfoResponse["blog_url"];
}
export const createInputShape: CreateInput = {
    name: userInfoResponseShape["user_name"],
    blogName: userInfoResponseShape["blog_name"],
    blogUrl: userInfoResponseShape["blog_url"],
}
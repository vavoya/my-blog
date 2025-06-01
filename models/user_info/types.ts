import {UserInfoDocument, UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";


export type UserInfoDocumentByBlogUrl = Pick<UserInfoDocument, '_id' | 'blog_url' | 'blog_name' | 'user_name'>
export type UserInfoResponseByBlogUrl = Pick<UserInfoResponse, '_id' | 'blog_url' | 'blog_name' | 'user_name'>

export type UserIdDocumentByAuthId = Pick<UserInfoDocument, '_id' | 'registration_state'>
export type UserIdResponseByAuthId = Pick<UserInfoResponse, '_id' | 'registration_state'>
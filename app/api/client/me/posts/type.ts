import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Response} from "@/app/api/types";
import {PostInput} from "@/services/server/post/postByUserId.type";

export type ReqBodyType = PostInput & {lastModified: UserInfoResponse['last_modified']}
export type ResBodyType = Response<{lastModified: UserInfoResponse['last_modified']}>

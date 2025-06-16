import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Response} from "@/app/api/types";
import {DeleteByUserIdType} from "@/services/server/folder/deleteByUserId.type";

export type ReqBodyType = DeleteByUserIdType & {lastModified: UserInfoResponse['last_modified']}
export type ResBodyType = Response<{lastModified: UserInfoResponse['last_modified']}>

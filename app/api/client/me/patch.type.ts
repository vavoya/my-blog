import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Response} from "@/app/api/types";
import {UpdateInput} from "@/services/server/update-user/updateByUserId.type";

export type ReqBodyType = (UpdateInput) & {lastModified: UserInfoResponse['last_modified']}
export type ResBodyType = Response<{lastModified: UserInfoResponse['last_modified']}>

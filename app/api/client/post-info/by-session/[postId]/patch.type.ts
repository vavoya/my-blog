import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Response} from "@/app/api/types";
import {PatchInput} from "@/services/server/post/patchByUserId/type";

export type ReqBodyType = PatchInput & {lastModified: UserInfoResponse['last_modified']}
export type ResBodyType = Response<{lastModified: UserInfoResponse['last_modified']}>

import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Response} from "@/app/api/types";
import {MoveInput} from "@/services/server/folder/moveByUserId.type";
import {RenameInput} from "@/services/server/folder/renameByUserId.type";

export type ReqBodyType = (MoveInput | RenameInput) & {lastModified: UserInfoResponse['last_modified']}
export type ResBodyType = Response<{lastModified: UserInfoResponse['last_modified']}>

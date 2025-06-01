import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Response} from "@/app/api/types";
import {PostInput} from "@/services/server/folder/postByUserId/type";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";

export type ReqBodyType = PostInput & {lastModified: UserInfoResponse['last_modified']}
export type ResBodyType = Response<{folderId: FolderInfoResponse['_id']; lastModified: UserInfoResponse['last_modified']}>


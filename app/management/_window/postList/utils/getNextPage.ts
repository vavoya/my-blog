import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import getByFolderId from "@/fetch/client/paginatedPost/getByFolderId";

export const getNextPage = async (userInfo: UserInfoResponse, folderId: FolderInfoResponse['_id'], page: number ) => {
    return await getByFolderId(userInfo._id, folderId, page);
}
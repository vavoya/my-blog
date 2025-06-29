import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import getByFolderId from "@/fetch/client/paginated-post/getByFolderId";

/**
 * 특정 폴더 내의 다음 페이지 항목들을 검색합니다.
 *
 * @async
 * @function
 * @param {UserInfoResponse} userInfo - 사용자 정보가 포함된 객체입니다.
 * @param {FolderInfoResponse['_id']} folderId - 항목을 검색할 폴더의 고유 식별자입니다.
 * @param {number} page - 검색할 페이지 번호입니다.
 * @returns {Promise<any>} 지정된 폴더와 페이지에서 검색된 데이터로 해결되는 프로미스를 반환합니다.
 */
export const getNextPage = async (userInfo: UserInfoResponse, folderId: FolderInfoResponse['_id'], page: number ) => {
    return await getByFolderId(userInfo._id, folderId, page);
}
import {response} from "@/app/api/_utils/createResponse";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PageNumberResult} from "@/data-access/pagination/page-num/type";
import {PaginatedPostsResponse} from "@/data-access/post-info/types";
import {Response} from "@/app/api/types";
import {
    createPostPreviewsQueryByPageNumber
} from "@/app/api/client/users/[userId]/post-previews/folder/[folderId]/page-number/[pageNumber]/createQuery";

export default async function getByFolderId(userId: UserInfoResponse['_id'], folderId: FolderInfoResponse['_id'], pageNumber: PageNumberResult['pageNumber']): Promise<Response<PaginatedPostsResponse[]>> {
    const apiUrl = createPostPreviewsQueryByPageNumber(userId, folderId, pageNumber);

    try {
        const result = await fetch(apiUrl);
        return await result.json();
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';

        return response.timeout(message);
    }
}

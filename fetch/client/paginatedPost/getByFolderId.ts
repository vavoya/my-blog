import {response} from "@/app/api/_utils/createResponse";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PageNumberResult} from "@/models/pagination/pageNum/type";
import {PaginatedPostsResponse} from "@/models/post_info/types";
import {path} from "@/app/api/client/paginated-posts/by-folderid/path";
import {Response} from "@/app/api/types";

export default async function getByFolderId(userId: UserInfoResponse['_id'], folderId: FolderInfoResponse['_id'], pagenum: PageNumberResult['pageNumber']) {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${path}?userid=${userId}&folderid=${folderId}&pagenum=${pagenum}`;

    try {
        const result = await fetch(apiUrl);
        const data: Response<PaginatedPostsResponse[]> = await result.json();
        return data;
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';
        return response.timeout(message);
    }
}

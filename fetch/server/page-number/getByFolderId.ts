import {response} from "@/app/api/_utils/createResponse";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";
import {PageNumberResult} from "@/data-access/pagination/page-num/type";
import {Response} from "@/app/api/types";
import {createPageNumberQuery} from "@/app/api/server/users/[userId]/folders/[folderId]/page-number/createQuery";

export default async function getByFolderId(userId: UserInfoResponse['_id'], folderId: FolderInfoResponse['_id'], postId: PostInfoResponse['_id']) {
    const apiUrl = createPageNumberQuery(folderId, userId, postId);

    try {
        const result = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                "x-internal-secret": process.env.INTERNAL_API_SECRET!,
            },
            cache: "force-cache",
            next: { tags: ['all', userId, `${userId}-folder-${folderId}}`] }
        });
        const data: Response<PageNumberResult> = await result.json();
        return data;
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';
        return response.timeout(message);
    }
}

import {route} from "@/app/api/server/folder-info/by-userid/route";
import {response} from "@/app/api/_utils/createResponse";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Response} from "@/app/api/types";

export default async function getByUserId(userId: UserInfoResponse['_id']) {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${route}?userid=${userId}`;

    try {
        const result = await fetch(apiUrl,  { cache: "force-cache", next: { tags: ['all', userId, `${userId}-folder`] } });
        const data: Response<FolderInfoResponse[]> = await result.json();
        return data;
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';
        return response.timeout(message);
    }
}

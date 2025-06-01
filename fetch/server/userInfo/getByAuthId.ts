import {response} from "@/app/api/_utils/createResponse";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {UserIdDocumentByAuthId} from "@/models/user_info/types";
import {path} from "@/app/api/server/user-info/by-authid/path";
import {Response} from "@/app/api/types";

export default async function getByAuthId(authId: UserInfoResponse['auth_id']) {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${path}?authid=${authId}`;


    try {
        const result = await fetch(apiUrl, { cache: "force-cache", next: { tags: ['all', authId] } });
        const data: Response<UserIdDocumentByAuthId> = await result.json();
        return data;
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';
        return response.timeout(message);
    }
}

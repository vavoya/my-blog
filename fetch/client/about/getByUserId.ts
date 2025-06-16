import {response} from "@/app/api/_utils/createResponse";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Response} from "@/app/api/types";
import {AboutInfoResponse} from "@/lib/mongoDB/types/documents/aboutInfo.type";
import {createAboutQuery} from "@/app/api/client/users/[userId]/about/createQuery";

export default async function getByUserId(userId: UserInfoResponse['_id']) {
    const apiUrl = createAboutQuery(userId);

    try {
        const result = await fetch(apiUrl);
        const data: Response<AboutInfoResponse> = await result.json();
        return data;
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';
        return response.timeout(message);
    }
}

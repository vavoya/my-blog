import {response} from "@/app/api/_utils/createResponse";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {path} from "@/app/api/client/about-info/by-userId/path";
import {Response} from "@/app/api/types";
import {AboutInfoResponse} from "@/lib/mongoDB/types/documents/aboutInfo.type";

export default async function getByUserId(userId: UserInfoResponse['_id']) {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${path}?userid=${userId}`;

    try {
        const result = await fetch(apiUrl, { cache: "force-cache", next: { tags: ['all', userId, `${userId}-about`] } });
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

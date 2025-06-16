import {response} from "@/app/api/_utils/createResponse";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import {Response} from "@/app/api/types";
import {createSeriesQuery} from "@/app/api/server/users/[userId]/series/createQuery";

export default async function getByUserId(userId: UserInfoResponse['_id']) {
    const apiUrl = createSeriesQuery(userId);

    try {
        const result = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                "x-internal-secret": process.env.INTERNAL_API_SECRET!,
            },
            cache: "force-cache",
            next: { tags: ['all', userId, `${userId}-series` ] }
        });
        const data: Response<SeriesInfoResponse[]> = await result.json();
        return data;
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';
        return response.timeout(message);
    }
}

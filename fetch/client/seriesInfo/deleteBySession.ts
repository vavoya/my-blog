import {response} from "@/app/api/_utils/createResponse";
import {path} from "@/app/api/client/series-info/by-session/path";
import {ReqBodyType, ResBodyType} from "@/app/api/client/series-info/by-session/[seriesId]/delete.type";

export default async function deleteBySession(json: ReqBodyType) {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${path}/${json.seriesId}`;

    try {
        const result = await fetch(apiUrl, {
            method: "DELETE",
            body: JSON.stringify(json)
        });
        const data: ResBodyType = await result.json();
        return data;
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';
        return response.timeout(message);
    }
}

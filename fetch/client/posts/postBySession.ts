import {response} from "@/app/api/_utils/createResponse";
import {ReqBodyType, ResBodyType} from "@/app/api/client/me/posts/type";
import {processApiResponse} from "@/fetch/utils/processApiResponse";
import {createPostQuery} from "@/app/api/client/me/posts/createQuery";

export default async function postBySession(json: ReqBodyType) {
    const apiUrl = createPostQuery();

    try {
        const result = await fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify(json)
        });
        return await processApiResponse<ResBodyType>(result);
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';
        return response.timeout(message);
    }
}

import {response} from "@/app/api/_utils/createResponse";
import {ResBodyType} from "@/app/api/client/me/delete.type";
import {createMeQuery} from "@/app/api/client/me/createQuery";

export default async function removeAccountBySession() {
    const apiUrl = createMeQuery();

    try {
        const result = await fetch(apiUrl, {
            method: "DELETE",
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

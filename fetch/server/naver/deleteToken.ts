import {response} from "@/app/api/_utils/createResponse";

export default async function deleteToken(accessToken: string) {
    const apiUrl = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${process.env.AUTH_NAVER_ID}&client_secret=${process.env.AUTH_NAVER_SECRET}&access_token=${accessToken}`;

    try {
        const result = await fetch(apiUrl,  {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const json: {
            access_token: string,
            result: string,
        } = await result.json();

        return response.ok(json);
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';
        return response.timeout(message);
    }
}

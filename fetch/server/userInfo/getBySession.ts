import {response} from "@/app/api/_utils/createResponse";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {cookies} from "next/headers";
import {Response} from "@/app/api/types";
import {path} from "@/app/api/server/user-info/by-userid/path";

export default async function getBySession() {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;

    const cookie  = await cookies();

    try {
        // nextjs server fetch는 브라우저가 지원하는 fetch 와 다르게 기본적으로 쿠키를 넣지 않기 때문에 명시적으로 쿠키를 넣어줘야한다.
        const result = await fetch(apiUrl, { next: { tags: ['all'] }, headers: { cookie: cookie.toString() }, cache: "no-store",});
        const data: Response<UserInfoResponse> = await result.json();
        return data;
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';
        return response.timeout(message);
    }
}

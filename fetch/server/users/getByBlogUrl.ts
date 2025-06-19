import {response} from "@/app/api/_utils/createResponse";
import {UserInfoResponseByBlogUrl} from "@/data-access/user-info/types";
import {Response} from "@/app/api/types";
import {createUserQuery} from "@/app/api/server/users/createQuery";

export default async function getByBlogUrl(blogUrl: UserInfoResponseByBlogUrl['blog_url']) {
    const apiUrl = createUserQuery(blogUrl);

    try {
        const result = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                "x-internal-secret": process.env.INTERNAL_API_SECRET!,
            },
            cache: "no-cache",
        });
        const data: Response<UserInfoResponseByBlogUrl> = await result.json();
        return data;
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';
        return response.timeout(message);
    }
}

import {response} from "@/app/api/_utils/createResponse";
import {UserInfoResponseByBlogUrl} from "@/models/user_info/types";
import {Response} from "@/app/api/types";
import {path} from "@/app/api/server/user-info/by-blogurl/path";

export default async function getByBlogUrl(blogUrl: UserInfoResponseByBlogUrl['blog_url']) {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${path}?blogurl=${blogUrl}`;

    try {
        const result = await fetch(apiUrl, { cache: "force-cache", next: { tags: ['all', blogUrl] } });
        console.log(result)
        const data: Response<UserInfoResponseByBlogUrl> = await result.json();
        return data;
    } catch (error) {
        console.log(process.env.NEXT_PUBLIC_BASE_URL, error, path)
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';
        return response.timeout(message);
    }
}

import {response} from "@/app/api/_utils/createResponse";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PaginatedPostsResponse} from "@/models/post_info/types";
import {path} from "@/app/api/client/paginated-posts/by-postids/path";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";
import {Response} from "@/app/api/types";

export default async function getByPostIds(userId: UserInfoResponse['_id'], postIds: PostInfoResponse['_id'][]) {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${path}?userid=${userId}&${postIds.map(postId => `postids=${postId}`).join('&')}`;

    try {
        const result = await fetch(apiUrl);
        const data: Response<PaginatedPostsResponse[]> = await result.json();
        return data;
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';
        return response.timeout(message);
    }
}

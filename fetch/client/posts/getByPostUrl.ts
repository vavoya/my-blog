import {response} from "@/app/api/_utils/createResponse";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";
import {Response} from "@/app/api/types";
import {createPostUrlQuery} from "@/app/api/client/users/[userId]/posts/[postUrl]/creatQuery";

export default async function getByPostUrl(userId: UserInfoResponse['_id'], postUrl: PostInfoResponse['post_url']) {
    const apiUrl = createPostUrlQuery(userId, postUrl,);

    try {
        const result = await fetch(apiUrl);
        const data: Response<PostInfoResponse> = await result.json();
        return data;
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';
        return response.timeout(message);
    }
}

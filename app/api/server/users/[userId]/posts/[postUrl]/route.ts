import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import validateAndTransform from "@/app/api/validateAndTransform";
import {jsonResponse} from "@/app/api/server/jsonResponse";
import getPostByPostUrl from "@/data-access/post-info/getPostByPostUrl";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";


type Params = Promise<{
    userId: UserInfoResponse['_id'];
    postUrl: PostInfoResponse['post_url'];
}>

/**
 * GET /api/server/posts/by-posturl
 *
 * 사용자 ID(`userid`)와 포스트 URL(`posturl`)을 기준으로 해당 포스트 정보를 조회합니다.
 *
 * @param {NextRequest} req - Next.js에서 전달되는 HTTP 요청 객체
 * @param params
 * @returns {Promise<Response>} - 포스트 응답
 * - 성공 시: `200 OK`와 포스트 데이터
 * - 잘못된 쿼리 파라미터: `400 Bad Request`
 * - 포스트 정보 없음: `404 Not Found`
 * - 내부 서버 오류: `500 Internal Server Error`
 *
 * @queryparam {string} userid - 사용자 ID (ObjectId 문자열)
 * @queryparam {string} posturl - 포스트 URL (고유 문자열)
 */

export async function GET(req: NextRequest, { params }: { params: Params }): Promise<Response> {
    let { userId, postUrl } = await params;

    try {
        userId = validateAndTransform(userId, 'string');
    } catch {
        return jsonResponse(response.badRequest('userid 파라미터가 유효하지 않습니다.'))
    }

    try {
        postUrl = validateAndTransform(postUrl, 'string');
    } catch {
        return jsonResponse(response.badRequest('posturl 파라미터가 유효하지 않습니다.'))
    }

    try {
        const results = await getPostByPostUrl(new ObjectId(userId), postUrl);
        if (!results) {
            return jsonResponse(response.notFound('포스트 정보가 없습니다.'));
        }

        return jsonResponse(response.ok(results));
    } catch (e) {
        console.error(e);

        return jsonResponse(response.error('서버 오류: 포스트 정보를 불러오는 중 문제가 발생했습니다.'));
    }
}

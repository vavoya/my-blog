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
 * GET /api/server/users/[userId]/posts/[postUrl]
 *
 * 사용자 ID와 포스트 URL을 기준으로 해당 포스트 정보를 조회한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @param {Object} params - 경로 파라미터 객체
 * @param {string} params.userId - 사용자 ID
 * @param {string} params.postUrl - 포스트 URL
 * @returns {Promise<Response>} API 응답 객체
 *
 * 성공 시:
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "post 정보" // PostInfoResponse 타입 참고
 *   }
 * }
 * ```
 *
 * 클라이언트 오류:
 * ```json
 * {
 *   "status": 400,
 *   "message": "파라미터가 유효하지 않습니다"
 * }
 * ```
 *
 * 서버 오류:
 * ```json
 * {
 *   "status": 404|500,
 *   "message": "오류 메시지"
 * }
 * ```
 *
 * 요청 예시:
 * ```
 * GET /api/server/users/507f1f77bcf86cd799439011/posts/my-first-post
 * ```
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

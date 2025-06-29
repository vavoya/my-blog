import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import validateAndTransform from "@/app/api/validateAndTransform";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import getPostsByPostIds from "@/data-access/post-info/getPostsByPostIds";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";

type Params = Promise<{
    userId: UserInfoResponse['_id'];
}>

/**
 * GET /api/client/users/[userId]/post-previews
 *
 * 주어진 사용자 ID와 포스트 ID 목록으로 해당 포스트들의 미리보기 정보를 조회합니다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @param {Object} params - 경로 파라미터 객체
 * @param {string} params.userId - 사용자 고유 ID
 * @returns {Promise<Response>} API 응답 객체
 *
 * 성공 시:
 * ```json
 * {
 *   "status": 200,
 *   "data": [
 *     {
 *       "id": "포스트ID",
 *       "title": "포스트제목",
 *       "description": "포스트설명", 
 *       "thumbnailUrl": "썸네일URL",
 *       "createdAt": "생성일시"
 *     }
 *   ]
 * }
 * ```
 *
 * 클라이언트 오류:
 * ```json
 * {
 *   "status": 400,
 *   "message": "user-id 파라미터가 유효하지 않습니다."
 * }
 * ```
 * 또는
 * ```json
 * {
 *   "status": 400, 
 *   "message": "id 파라미터가 유효하지 않습니다."
 * }
 * ```
 *
 * 서버 오류:
 * ```json
 * {
 *   "status": 404,
 *   "message": "페이지 정보가 없습니다."
 * }
 * ```
 * 또는
 * ```json
 * {
 *   "status": 500,
 *   "message": "서버 오류: 페이지 정보를 불러오는 중 문제가 발생했습니다."
 * }
 * ```
 *
 * 요청 예시:
 * ```
 * GET /api/client/users/abc123/post-previews?id=post1&id=post2
 * ```
 */
export async function GET(req: NextRequest, { params }: { params: Params }): Promise<Response> {
    const searchParams = req.nextUrl.searchParams;
    let { userId } = await params;
    let postIds = searchParams.getAll('id');

    try {
        userId = validateAndTransform(userId, 'string');
    } catch {
        return jsonResponse(response.badRequest('user-id 파라미터가 유효하지 않습니다.'))
    }

    try {
        postIds = validateAndTransform(postIds, 'string');
    } catch {
        return jsonResponse(response.badRequest('id 파라미터가 유효하지 않습니다.'))
    }

    try {
        const results = await getPostsByPostIds(new ObjectId(userId), postIds.map(postId => new ObjectId(postId)));
        if (!results) {
            return jsonResponse(response.notFound('페이지 정보가 없습니다.'));
        }

        return jsonResponse(response.ok(results));
    } catch (e) {
        console.error(e);

        return jsonResponse(response.error('서버 오류: 페이지 정보를 불러오는 중 문제가 발생했습니다.'));
    }
}

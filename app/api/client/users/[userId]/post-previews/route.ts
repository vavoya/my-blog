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
 * GET /api/client/paginated-posts/by-postids
 *
 * 주어진 사용자 ID(`userid`)와 포스트 ID 목록(`postids`)을 기반으로
 * 해당 포스트들의 정보를 조회합니다.
 *
 * @param {NextRequest} req - Next.js HTTP 요청 객체
 * @param params
 * @returns {Promise<Response>} - JSON 형태의 응답
 * - 성공: 200 OK와 포스트 정보 배열
 * - 잘못된 파라미터: 400 Bad Request
 * - 결과 없음: 404 Not Found
 * - 서버 오류: 500 Internal Server Error
 *
 * @queryparam {string} userid - 사용자 ID (ObjectId 문자열)
 * @queryparam {string[]} postids - 조회할 포스트 ID 배열 (ObjectId 문자열)
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

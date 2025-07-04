import getSeriesInfoByUserId from "@/data-access/series-info/getSeriesInfoByUserId";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import validateAndTransform from "@/app/api/validateAndTransform";
import {jsonResponse} from "@/app/api/server/jsonResponse";

type Params = Promise<{
    userId: string;
}>

/**
 * GET /api/server/users/[userId]/series
 *
 * 사용자 ID에 해당하는 시리즈 정보를 조회한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @param {Object} params - 경로 파라미터 객체
 * @param {string} params.userId - 조회할 사용자의 고유 ID
 * @returns {Promise<Response>} - API 응답 객체
 *
 * 성공 시:
 * ```json
 * {
 *   "status": 200,
 *   "data": [
 *     {
 *       "id": "시리즈 ID",
 *       "name": "시리즈 이름",
 *       "description": "시리즈 설명",
 *       "createdAt": "생성 시각(ISO8601)",
 *       "updatedAt": "수정 시각(ISO8601)"
 *     },
 *     ...
 *   ]
 * }
 * ```
 *
 * 클라이언트 오류:
 * ```json
 * {
 *   "status": 400,
 *   "message": "userid 파라미터가 유효하지 않습니다."
 * }
 * ```
 *
 * 서버 오류:
 * ```json
 * {
 *   "status": 404|500,
 *   "message": "시리즈 정보가 없습니다.|서버 오류: 시리즈 정보를 불러오는 중 문제가 발생했습니다."
 * }
 * ```
 */
export async function GET(req: NextRequest, { params }: { params: Params }): Promise<Response> {
    let { userId } = await params;

    try {
        userId = validateAndTransform(userId, 'string');
    } catch {
        return jsonResponse(response.badRequest('userid 파라미터가 유효하지 않습니다.'))
    }

    try {
        const results = await getSeriesInfoByUserId(new ObjectId(userId));
        if (!results) {
            return jsonResponse(response.notFound('시리즈 정보가 없습니다.'));
        }

        return jsonResponse(response.ok(results));
    } catch (e) {
        console.error(e);

        return jsonResponse(response.error('서버 오류: 시리즈 정보를 불러오는 중 문제가 발생했습니다.'));
    }
}

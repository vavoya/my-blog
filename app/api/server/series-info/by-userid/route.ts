import getSeriesInfoByUserId from "@/models/series_info/getSeriesInfoByUserId";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import validateAndTransform from "@/app/api/validateAndTransform";
import {jsonResponse} from "@/app/api/server/jsonResponse";

export const route = '/api/server/series-info/by-userid'
/**
 * GET /api/server/folder-info/by-userid
 *
 * 사용자 ID(`userid`)를 기준으로 해당 사용자가 소유한 시리즈 정보를 조회합니다.
 *
 * @param {NextRequest} req - Next.js에서 전달되는 HTTP 요청 객체
 * @returns {Promise<Response>} - 시리즈 목록 응답
 * - 성공 시: `200 OK`와 시리즈 정보 배열
 * - 잘못된 쿼리 파라미터: `400 Bad Request`
 * - 시리즈 정보 없음: `404 Not Found`
 * - 내부 서버 오류: `500 Internal Server Error`
 *
 * @queryparam {string} userid - 사용자 ID (ObjectId 문자열)
 */

export async function GET(req: NextRequest): Promise<Response> {
    const searchParams = req.nextUrl.searchParams;
    let userId;

    try {
        userId = validateAndTransform(searchParams.get('userid'), 'string');
    } catch {
        return jsonResponse(response.badRequest('userid 파라미터가 유효하지 않습니다.'))
    }

    try {
        const results = await getSeriesInfoByUserId(new ObjectId(userId));
        if (!results || results.length === 0) {
            return jsonResponse(response.notFound('시리즈 정보가 없습니다.'));
        }

        return jsonResponse(response.ok(results));
    } catch (e) {
        console.error(e);

        return jsonResponse(response.error('서버 오류: 시리즈 정보를 불러오는 중 문제가 발생했습니다.'));
    }
}

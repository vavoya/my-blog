import { NextRequest } from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import validateAndTransform from "@/app/api/validateAndTransform";
import {jsonResponse} from "@/app/api/server/jsonResponse";
import getUserInfoByBlogUrl from "@/models/user_info/getUserInfoByBlogUrl";

export const route = '/api/server/user-info/by-blogurl'
/**
 * GET /api/server/user-info/by-blogurl
 *
 * 블로그 URL(`blogurl`)을 기준으로 해당 사용자 정보를 조회합니다.
 *
 * @param {NextRequest} req - Next.js에서 전달되는 HTTP 요청 객체
 * @returns {Promise<Response>} - 사용자 정보 응답
 * - 성공 시: `200 OK`와 사용자 데이터
 * - 잘못된 쿼리 파라미터: `400 Bad Request`
 * - 사용자 정보 없음: `404 Not Found`
 * - 내부 서버 오류: `500 Internal Server Error`
 *
 * @queryparam {string} blogurl - 블로그 URL (고유 문자열)
 */
export async function GET(req: NextRequest): Promise<Response> {
    const searchParams = req.nextUrl.searchParams;
    let blogUrl;
    try {
        blogUrl = validateAndTransform(searchParams.get('blogurl'), 'string');
    } catch {
        return jsonResponse(response.badRequest('blogurl 파라미터가 유효하지 않습니다.'))
    }

    try {
        const results = await getUserInfoByBlogUrl(blogUrl);
        if (!results) {
            return jsonResponse(response.notFound('블로그 정보가 없습니다.'));
        }

        return jsonResponse(response.ok(results));
    } catch {

        return jsonResponse(response.error('서버 오류: 폴더 정보를 불러오는 중 문제가 발생했습니다.'));
    }
}

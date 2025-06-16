import { response } from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/server/jsonResponse";
import findUserIdAndUpdateLoginByAuthId from "@/data-access/user-info/findUserIdAndUpdateLoginByAuthId";
import {NextRequest} from "next/server";
import validateAndTransform from "@/app/api/validateAndTransform";
import getUserInfoByBlogUrl from "@/data-access/user-info/getUserInfoByBlogUrl";

/**
 * GET /api/server/users/by-authid
 *
 * 주어진 authId에 대응하는 사용자 정보를 조회합니다.
 *
 * 요청 쿼리 파라미터:
 * - authid: string (필수) - 인증 제공자의 사용자 ID
 *
 * 응답 코드:
 * - 200 OK: 사용자 정보 조회 성공 (JSON 반환)
 * - 400 Bad Request: authid가 유효하지 않음
 * - 404 Not Found: 해당 authId에 대한 사용자 정보 없음
 * - 500 Internal Server Error: 서버 처리 중 오류 발생
 */
export async function GET(req: NextRequest): Promise<Response> {
    const searchParams = req.nextUrl.searchParams;
    let authId = searchParams.get('auth-id');
    let blogUrl = searchParams.get('blog-url');

    if (authId) {
        try {
            authId = validateAndTransform(authId, 'string');
        } catch {
            return jsonResponse(response.badRequest('authid 파라미터가 유효하지 않습니다.'))
        }
    }

    if (blogUrl) {
        try {
            blogUrl = validateAndTransform(blogUrl, 'string');
        } catch {
            return jsonResponse(response.badRequest('authid 파라미터가 유효하지 않습니다.'))
        }
    }


    try {
        let result = null
        if (authId) {
            result = await findUserIdAndUpdateLoginByAuthId(authId)
        } else if (blogUrl) {
            result = await getUserInfoByBlogUrl(blogUrl);
        }

        if (!result) {
            return jsonResponse(response.notFound('유저 정보가 없습니다.'));
        }

        return jsonResponse(response.ok(result));
    } catch {

        return jsonResponse(response.error('서버 오류: 유저 정보를 불러오는 중 문제가 발생했습니다.'));
    }
}

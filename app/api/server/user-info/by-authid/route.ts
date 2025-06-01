import { response } from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/server/jsonResponse";
import getUserIdByAuthId from "@/models/user_info/getUserIdByAuthId";
import {NextRequest} from "next/server";
import validateAndTransform from "@/app/api/validateAndTransform";

export const route = '/api/server/user-info/by-authid'
/**
 * GET /api/server/user-info/by-authid
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
    let authId;
    try {
        authId = validateAndTransform(searchParams.get('authid'), 'string');
    } catch {
        return jsonResponse(response.badRequest('authid 파라미터가 유효하지 않습니다.'))
    }



    try {
        const result = await getUserIdByAuthId(authId)
        if (!result) {
            return jsonResponse(response.notFound('유저 정보가 없습니다.'));
        }

        return jsonResponse(response.ok(result));
    } catch {

        return jsonResponse(response.error('서버 오류: 유저 정보를 불러오는 중 문제가 발생했습니다.'));
    }
}

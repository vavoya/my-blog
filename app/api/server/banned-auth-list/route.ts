import { response } from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/server/jsonResponse";
import {NextRequest} from "next/server";
import validateAndTransform from "@/app/api/validateAndTransform";
import getBannedAuthDocument from "@/data-access/banned-auth-list/getBannedAuthDocument";

/**
 * GET /api/server/banned-auth-list/by-authid
 *
 * 인증 제공자의 인증 ID를 통해 해당 계정이 차단된 계정인지 조회한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @returns {Promise<NextResponse<GetResBodyType>>} - API 응답 객체
 *
 * 성공 시:
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "isBanned": boolean,
 *     "cause": string,
 *     "blockedAt": "ISO8601 문자열"
 *   }
 * }
 * ```
 *
 * 클라이언트 오류:
 * ```json
 * {
 *   "status": 400,
 *   "message": "오류 메시지"
 * }
 * ```
 *
 * 서버 오류:
 * ```json
 * {
 *   "status": 500,
 *   "message": "오류 메시지"
 * }
 * ```
 *
 * 요청 예시:
 * ```json
 * GET /api/server/banned-auth-list/by-authid?authid=123456789
 * ```
 */
export async function GET(req: NextRequest): Promise<Response> {
    const searchParams = req.nextUrl.searchParams;
    let authId;
    try {
        authId = validateAndTransform(searchParams.get('auth-id'), 'string');
    } catch {
        return jsonResponse(response.badRequest('auth-id 파라미터가 유효하지 않습니다.'))
    }



    try {
        const result = await getBannedAuthDocument(authId)
        return jsonResponse(response.ok(result));
    } catch {

        return jsonResponse(response.error('서버 오류: 유저 정보를 불러오는 중 문제가 발생했습니다.'));
    }
}

import getUserInfoByUserId from "@/data-access/user-info/getUserInfoByUserId";
import {response} from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/server/jsonResponse";
import {ObjectId} from "mongodb";
import {checkAuth} from "@/app/api/_utils/checkAuth";
import {auth} from "@/auth";

/**
 * GET /api/server/me/user
 *
 * 현재 인증된 사용자의 정보를 조회한다.
 *
 * @param {NextAuthRequest} req - API 요청 객체
 * @returns {Promise<Response>} - API 응답 객체
 *
 * 성공 시:
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "user": {
 *        // 사용자 정보 객체
 *     }
 *   }
 * }
 * ```
 *
 * 클라이언트 오류:
 * ```json
 * {
 *   "status": 401,
 *   "message": "인증 오류: 인증 정보가 없습니다."
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
 * ```json
 * GET /api/server/me/user
 * Authorization: Bearer {access_token}
 * ```
 */
export const GET = auth(async function GET(req): Promise<Response> {
    const authResult = await checkAuth(req);

    // authResult가 string이면 userId, 아니면 바로 응답 객체
    if (typeof authResult !== 'string') {
        return authResult; // jsonResponse 반환
    }

    try {
        const results = await getUserInfoByUserId(new ObjectId(authResult));
        if (!results) {
            return jsonResponse(response.notFound('유저 정보가 없습니다.'));
        }

        return jsonResponse(response.ok(results));
    } catch {

        return jsonResponse(response.error('서버 오류: 유저 정보를 불러오는 중 문제가 발생했습니다.'));
    }
})
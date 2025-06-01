import getUserInfoByUserId from "@/models/user_info/getUserInfoByUserId";
import {response} from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/server/jsonResponse";
import {ObjectId} from "mongodb";
import {checkAuth} from "@/app/api/_utils/checkAuth";

export const route = '/api/server/user-info/by-userid'
/**
 * GET /api/server/user-info/by-userid
 *
 * 현재 인증된 사용자의 userId를 기반으로 사용자 정보를 조회합니다.
 * @returns {Promise<Response>} - 사용자 정보 응답
 *
 * 응답 형태:
 * - 200 OK: 사용자 정보 조회 성공
 * - 401 Unauthorized: 인증 정보가 없거나 유효하지 않음
 * - 404 Not Found: 사용자 정보를 찾을 수 없음
 * - 500 Internal Server Error: 서버 내부 오류
 */
export async function GET(): Promise<Response> {
    const authResult = await checkAuth();

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
}

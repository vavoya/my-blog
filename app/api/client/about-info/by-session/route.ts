import {NextRequest, NextResponse} from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import {checkAuth} from "@/app/api/_utils/checkAuth";
import {isConvertibleToDate} from "@/utils/isConvertibleToDate";
import {ResBodyType} from "@/app/api/client/about-info/by-session/type";
import patchByUserId from "@/services/server/about/patchByUserId/patchByUserId";
import {validateUpdateAbout} from "@/validation/server/about/validateUpdateAbout";
import {revalidateTag} from "next/cache";

/**
 * PATCH /api/client/about-info/by-session
 *
 * 로그인된 사용자 세션을 기반으로 자신의 소개글을 수정합니다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @returns {Promise<NextResponse<ResBodyType>>} - 응답 객체
 *
 * 성공 시:
 *   - 200 OK: 소개글 수정 성공, 수정된 `lastModified` 정보 반환
 *
 * 클라이언트 오류:
 *   - 400 Bad Request: 입력 데이터 유효성 검사 실패 (`lastModified` 또는 필드 유효성 실패)
 *   - 401 Unauthorized: 인증 실패 (`checkAuth` 실패 시)
 *
 * 서버 오류:
 *   - 404 Not Found: 사용자 정보 없음
 *   - 409 Conflict: `lastModified` 불일치 (동시 수정 충돌)
 *   - 500 Internal Server Error: 데이터베이스 트랜잭션 또는 기타 내부 오류
 *
 * 요청 본문(JSON):
 * {
 *   "_id": "id",
 *   "userId": "userId",
 *   "content": "내용",
 *   "lastModified": "2024-05-29T00:00:00.000Z" // ISO8601 형식 문자열 (필수)
 * }
 */

export async function PATCH(req: NextRequest): Promise<NextResponse<ResBodyType>> {
    const authResult = await checkAuth();

    // authResult가 string이면 userId, 아니면 바로 응답 객체
    if (typeof authResult !== 'string') {
        return authResult; // jsonResponse 반환
    }

    const userId = authResult;
    const body = await req.json();

    const lastModified = body["lastModified"];
    delete body["lastModified"];

    if (!isConvertibleToDate(lastModified) || !validateUpdateAbout(body)) {
        return jsonResponse(response.badRequest('입력 데이터가 유효하지 않습니다.'));
    }

    // 일단 한번 더 넣기.
    body.userId = userId;

    try {
        const results = await patchByUserId({
            ...body,
            lastModified
        });

        if (results.success) {
            revalidateTag(`${userId}`);
            return jsonResponse(response.ok({
                lastModified: results.data.lastModified.toISOString()
            }));
        }

        switch (results.error) {
            case "LastModifiedMismatch":
                return jsonResponse(response.conflict(results.message));
            case "UserNotFound":
                return jsonResponse(response.notFound(results.message));
            case "UpdateAboutError":
            case "TransactionError":
                return jsonResponse(response.error(results.message)); // 500 Internal Server Error
            default:
                return jsonResponse(response.error('알 수 없는 오류가 발생했습니다.'));
        }
    } catch (e) {
        console.error(e);
        return jsonResponse(response.error('서버 오류: 포스트 정보를 처리하는 중 문제가 발생했습니다.'));
    }
}

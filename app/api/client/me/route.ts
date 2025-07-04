import {NextResponse} from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import {checkAuth} from "@/app/api/_utils/checkAuth";
import {isConvertibleToDate} from "@/utils/isConvertibleToDate";
import {revalidateTag} from "next/cache";
import {auth} from "@/auth";
import {validateRemoveAccount} from "@/validation/server/remove-account/validateRemoveAccount";
import removeByUserId from "@/services/server/remove-account/removeByUserId";
import {ResBodyType} from "@/app/api/client/me/registration/type";
import {validateUpdateUser} from "@/validation/server/update-user/validateUpdateUser";
import updateByUserId from "@/services/server/update-user/updateByUserId";
import {ResBodyType as PatchResBodyType} from "@/app/api/client/me/patch.type";

/**
 * PATCH /api/client/me/patch
 *
 * 인증된 사용자의 정보를 부분 수정한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @returns {Promise<NextResponse<PatchResBodyType>>} - API 응답 객체
 *
 * 성공 시:
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "lastModified": "ISO8601 문자열"
 *   }
 * }
 * ```
 *
 * 클라이언트 오류:
 * ```json
 * {
 *   "status": 400|401,
 *   "message": "오류 메시지"
 * }
 * ```
 *
 * 서버 오류:
 * ```json
 * {
 *   "status": 404|409|500,
 *   "message": "오류 메시지"
 * }
 * ```
 *
 * 요청 예시:
 * ```json
 * PATCH /api/client/me/patch
 * {
 *   "userId": "유저ID", 
 *   "userName": "새 유저 이름",
 *   "blogName": "새 블로그 이름",
 *   "lastModified": "2024-05-28T01:23:45.678Z"
 * }
 * ```
 */
export const PATCH = auth(async function PATCH(req): Promise<NextResponse<PatchResBodyType>> {
    const authResult = await checkAuth(req);

    // authResult가 string이면 userId, 아니면 바로 응답 객체
    if (typeof authResult !== 'string') {
        return authResult; // jsonResponse 반환
    }

    const userId = authResult;
    const body = await req.json();

    const lastModified = body["lastModified"];
    delete body["lastModified"];

    if (!isConvertibleToDate(lastModified) || !validateUpdateUser(body)) {
        return jsonResponse(response.badRequest('입력 데이터가 유효하지 않습니다.'));
    }



    // 일단 한번 더 넣기.
    body.userId = userId;

    try {
        const results = await updateByUserId({
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
            case "TransactionError":
                return jsonResponse(response.error(results.message)); // 500 Internal Server Error
            default:
                return jsonResponse(response.error('알 수 없는 오류가 발생했습니다.'));
        }
    } catch (e) {
        console.error(e);
        return jsonResponse(response.error('서버 오류: 포스트 정보를 처리하는 중 문제가 발생했습니다.'));
    }
})


/**
 * DELETE /api/client/me
 *
 * 인증된 사용자의 계정을 삭제한다.
 * 요청 body 데이터 검증 후 계정 삭제를 처리한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @returns {Promise<NextResponse<ResBodyType>>} - API 응답 객체
 *
 * 성공 시:
 * ```json
 * {
 *   "status": 200,
 *   "data": true
 * }
 * ```
 *
 * 클라이언트 오류:
 * ```json
 * {
 *   "status": 400|401,
 *   "message": "오류 메시지"
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
 * DELETE /api/client/me
 * {
 *   "userId": "유저ID"
 * }
 * ```
 */
export const DELETE = auth(async function DELETE(req): Promise<NextResponse<ResBodyType>> {
    const authResult = await checkAuth(req);

    // authResult가 string이면 userId, 아니면 바로 응답 객체
    if (typeof authResult !== 'string') {
        return authResult; // jsonResponse 반환
    }

    const session = req.auth!;

    const body = {
        userId: session.userId,
    }

    if (!validateRemoveAccount(body)) {
        return jsonResponse(response.badRequest('입력 데이터가 유효하지 않습니다.'));
    }

    try {
        const results = await removeByUserId({
            ...body,
        });

        if (results.success) {
            // 유저 관련 세션 초기화
            if (session.authId) revalidateTag(session.authId);
            if (session.userId) revalidateTag(session.userId);
            return jsonResponse(response.ok(true))
        }

        switch (results.error) {
            case "UserNotFound":
                return jsonResponse(response.notFound(results.message));
            case "NaverOAuthUnlinkFailed":
                return jsonResponse(response.failedDependency(results.message));
            case "TransactionError":
                return jsonResponse(response.error(results.message)); // 500 Internal Server Error
            default:
                return jsonResponse(response.error('알 수 없는 오류가 발생했습니다.'));
        }
    } catch (e) {
        console.error(e);
        return jsonResponse(response.error('서버 오류: 회원 탈퇴를 처리하는 중 문제가 발생했습니다.'));
    }
})
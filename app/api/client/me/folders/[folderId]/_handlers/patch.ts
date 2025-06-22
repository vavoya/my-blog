import {NextResponse} from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import {checkAuth} from "@/app/api/_utils/checkAuth";
import {isConvertibleToDate} from "@/utils/isConvertibleToDate";
import {ResBodyType as PatchResBodyType} from "@/app/api/client/me/folders/[folderId]/patch.type";
import renameByUserId from "@/services/server/folder/renameByUserId";
import moveByUserId from "@/services/server/folder/moveByUserId";
import {validateMoveFolder} from "@/validation/server/folder/validateMoveFolder"
import {validateRenameFolder} from "@/validation/server/folder/validateRenameFolder"
import {revalidateTag} from "next/cache";
import type {NextAuthRequest} from "next-auth";

/**
 * PATCH /api/client/posts/by-session/[seriesId]
 *
 * 인증된 사용자의 특정 폴더 정보를 부분 수정한다.
 * 경로 파라미터 folderId에 해당하는 폴더의 이름 또는 위치(부모 폴더)를 수정한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @param {Object} params - 경로 파라미터 객체
 * @param {string} params.[folderId] - 수정할 폴더의 고유 ID
 * @returns {Promise<NextResponse<PutResBodyType>>} - API 응답 객체
 *
 * 성공 시:
 *   - 200 OK: 폴더 정보가 정상적으로 수정됨
 *     {
 *       "lastModified": "ISO8601 문자열"
 *     }
 *
 * 클라이언트 오류:
 *   - 400 Bad Request: 입력 데이터 형식, 필수값 누락, [folderId] 불일치 등 유효성 검사 실패
 *   - 401 Unauthorized: 인증 실패 (checkAuth 내부 처리)
 *
 * 서버 오류:
 *   - 404 Not Found: 해당 유저 또는 폴더 리소스를 찾을 수 없음
 *   - 409 Conflict: lastModified 불일치 등 버전 충돌
 *   - 500 Internal Server Error: 서버 내부 처리 오류, DB 내부 오류
 *
 * 요청 경로 예시:
 *   PATCH /api/client/posts/by-session/abc123
 *
 * 요청 바디 예시 (이름 변경):
 *   {
 *     "[folderId]": "abc123",              // 경로 folderId와 반드시 일치
 *     "name": "새 폴더 이름",
 *     "lastModified": "2024-05-28T01:23:45.678Z"
 *   }
 *
 * 요청 바디 예시 (폴더 이동):
 *   {
 *     "[folderId]": "abc123",              // 경로 folderId와 반드시 일치
 *     "parentFolderId": "부모폴더ID",
 *     "lastModified": "2024-05-28T01:23:45.678Z"
 *   }
 */
export async function pathHandler(req: NextAuthRequest, { params }: { params: Promise<{ folderId: string }> }): Promise<NextResponse<PatchResBodyType>> {
    const authResult = await checkAuth(req);

    // authResult가 string이면 userId, 아니면 바로 응답 객체
    if (typeof authResult !== 'string') {
        return authResult; // jsonResponse 반환
    }

    const userId = authResult;
    const body = await req.json();

    const lastModified = body["lastModified"];
    delete body["lastModified"];

    const folderId = (await params).folderId;

    if (!isConvertibleToDate(lastModified)) {
        return jsonResponse(response.badRequest('입력 데이터가 유효하지 않습니다.'));
    }

    let actionHandler;
    if (validateRenameFolder(body) && body.folderId === folderId) {
        actionHandler = () => renameByUserId({
            ...body,
            lastModified
        });
        // 이름 변경 로직
    } else if (validateMoveFolder(body) && body.folderId === folderId) {
        actionHandler = () => moveByUserId({
            ...body,
            lastModified
        });
        // 위치 이동 로직
    } else {
        return jsonResponse(response.badRequest('입력 데이터가 유효하지 않습니다.'));
    }


    // 일단 한번 더 넣기.
    body.userId = userId;

    try {
        const results = await actionHandler();

        if (results.success) {
            revalidateTag(`${userId}`);
            return jsonResponse(response.ok({
                lastModified: results.data.lastModified.toISOString()
            }));
        }

        switch (results.error) {
            case "LastModifiedMismatch":
                return jsonResponse(response.conflict(results.message));
            case "UpdateFailed":
            case "pForderNotFound":
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
}
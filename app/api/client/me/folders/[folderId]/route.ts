import {NextResponse} from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import {checkAuth} from "@/app/api/_utils/checkAuth";
import {isShape} from "@/utils/isShape";
import {isConvertibleToDate} from "@/utils/isConvertibleToDate";
import {ResBodyType as PatchResBodyType} from "@/app/api/client/me/folders/[folderId]/patch.type";
import {ResBodyType as DeleteResBodyType} from "@/app/api/client/me/folders/[folderId]/delete.type";
import deleteByUserId from "@/services/server/folder/deleteByUserId";
import {deleteInputShape} from "@/services/server/folder/deleteByUserId.type";
import renameByUserId from "@/services/server/folder/renameByUserId";
import moveByUserId from "@/services/server/folder/moveByUserId";
import {validateMoveFolder} from "@/validation/server/folder/validateMoveFolder"
import {validateRenameFolder} from "@/validation/server/folder/validateRenameFolder"
import {revalidateTag} from "next/cache";
import {auth} from "@/auth";

/**
 * PATCH /api/client/me/folders/[folderId]
 *
 * 인증된 사용자의 특정 폴더 정보를 부분 수정한다.
 * 경로 파라미터 folderId에 해당하는 폴더의 이름 또는 위치(부모 폴더)를 수정한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @param {Object} params - 경로 파라미터 객체
 * @param {string} params.folderId - 수정할 폴더의 고유 ID
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
 * PATCH /api/client/me/folders/abc123
 * {
 *   "folderId": "abc123",
 *   "name": "새 폴더 이름", 
 *   "lastModified": "2024-05-28T01:23:45.678Z"
 * }
 * ```
 * 또는
 * ```json
 * PATCH /api/client/me/folders/abc123
 * {
 *   "folderId": "abc123",
 *   "parentFolderId": "부모폴더ID",
 *   "lastModified": "2024-05-28T01:23:45.678Z"  
 * }
 * ```
 */
export const PATCH = auth(async function PATCH(req, { params }: { params: Promise<{ folderId: string }> }): Promise<NextResponse<PatchResBodyType>> {
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
})


/**
 * DELETE /api/client/me/folders/[folderId]
 *
 * 인증된 사용자의 특정 폴더 정보를 삭제한다.
 * 경로 파라미터 folderId에 해당하는 폴더를, 요청 body 데이터 검증 후 삭제 처리한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @param {Object} params - 경로 파라미터 객체
 * @param {string} params.folderId - 삭제할 폴더의 고유 ID
 * @returns {Promise<NextResponse<DeleteResBodyType>>} - API 응답 객체
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
 * DELETE /api/client/me/folders/abc123 
 * {
 *   "folderId": "abc123",        // 경로 folderId와 반드시 일치
 *   "lastModified": "2024-05-28T01:23:45.678Z"
 * }
 * ```
 */
export const DELETE = auth(async function DELETE(req, { params }: { params: Promise<{ folderId: string }> }): Promise<NextResponse<DeleteResBodyType>> {
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

    if (!isConvertibleToDate(lastModified) || !isShape(body, deleteInputShape) || body.folderId !== folderId) {
        return jsonResponse(response.badRequest('입력 데이터가 유효하지 않습니다.'));
    }

    // 일단 한번 더 넣기.
    body.userId = userId;

    try {
        const results = await deleteByUserId({
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
            case "FolderNotFound":
                return jsonResponse(response.notFound(results.message));
            case "UserNotFound":
                return jsonResponse(response.notFound(results.message));
            case "UpdatePostFailed":
            case "UpdateFolderFailed":
                return jsonResponse(response.error(results.message));
            case "DeleteFailed":
                return jsonResponse(response.error(results.message)); // 500 Internal Server Error
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
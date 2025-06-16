import {NextResponse} from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import {checkAuth} from "@/app/api/_utils/checkAuth";
import patchByUserId from "@/services/server/post/patchByUserId";
import {isShape} from "@/utils/isShape";
import {isConvertibleToDate} from "@/utils/isConvertibleToDate";
import {ResBodyType as PutResBodyType} from "@/app/api/client/me/posts/[postId]/patch.type";
import {ResBodyType as DeleteResBodyType} from "@/app/api/client/me/posts/[postId]/delete.type";
import deleteByUserId from "@/services/server/post/deleteByUserId";
import {deleteInputShape} from "@/services/server/post/deleteByUserId.type";
import {validateUpdatePost} from "@/validation/server/post/validateUpdatePost";
import {revalidateTag} from "next/cache";
import {auth} from "@/auth";

/**
 * PATCH /api/client/posts/by-session/[seriesId]
 *
 * 인증된 사용자의 특정 포스트 정보를 전체 교체(덮어쓰기)한다.
 * 경로 파라미터 postId에 해당하는 포스트를, 요청 body의 데이터로 대체한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @param {Object} params - 경로 파라미터 객체
 * @param {string} params.postId - 교체할 포스트의 고유 ID
 * @returns {Promise<NextResponse<ResBodyType>>} - API 응답 객체
 *
 * 성공 시:
 *   - 200 OK: 포스트가 정상적으로 교체됨
 *     {
 *       "lastModified": "ISO8601 문자열"
 *     }
 *
 * 클라이언트 오류:
 *   - 400 Bad Request: 입력 데이터 형식, 필수값 누락, postId 불일치 등 유효성 검사 실패
 *   - 401 Unauthorized: 인증 실패 (checkAuth 내부 처리)
 *
 * 서버 오류:
 *   - 404 Not Found: 해당 유저 또는 리소스를 찾을 수 없음
 *   - 409 Conflict: lastModified 불일치 등 버전 충돌
 *   - 500 Internal Server Error: 서버 내부 처리 오류, DB 내부 오류
 *
 * 요청 경로 예시:
 *   PATCH /api/client/posts/by-session/abc123
 *
 * 요청 바디 예시:
 *   {
 *     "_id": "abc123",              // 경로 postId와 반드시 일치
 *     "postName": "제목",
 *     "postContent": "내용",
 *     "postDescription": "설명",
 *     "thumbUrl": "썸네일 URL",
 *     "[folderId]": "폴더 ID",
 *     "lastModified": "2024-05-28T01:23:45.678Z"
 *   }
 */
export const PATCH = auth(async function PATCH(req, { params }: { params: Promise<{ postId: string }> }): Promise<NextResponse<PutResBodyType>> {
    const authResult = await checkAuth(req);

    // authResult가 string이면 userId, 아니면 바로 응답 객체
    if (typeof authResult !== 'string') {
        return authResult; // jsonResponse 반환
    }

    const userId = authResult;
    const body = await req.json();

    const lastModified = body["lastModified"];
    delete body["lastModified"];

    const postId = (await params).postId;

    if (!isConvertibleToDate(lastModified) || !validateUpdatePost(body) || body._id !== postId) {
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
            case "PostNotFound":
                return jsonResponse(response.notFound(results.message));
            case "UpdatePostError":
            case "UpdateFolderError":
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
 * DELETE /api/client/posts/by-session/[seriesId]
 *
 * 인증된 사용자의 특정 포스트 정보를 삭제한다.
 * 경로 파라미터 postId에 해당하는 포스트를, 요청 body의 데이터 검증 후 삭제 처리한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @param {Object} params - 경로 파라미터 객체
 * @param {string} params.postId - 삭제할 포스트의 고유 ID
 * @returns {Promise<NextResponse<ResBodyType>>} - API 응답 객체
 *
 * 성공 시:
 *   - 200 OK: 포스트가 정상적으로 삭제됨
 *     {
 *       "lastModified": "ISO8601 문자열"
 *     }
 *
 * 클라이언트 오류:
 *   - 400 Bad Request: 입력 데이터 형식, 필수값 누락, postId 불일치 등 유효성 검사 실패
 *   - 401 Unauthorized: 인증 실패 (checkAuth 내부 처리)
 *
 * 서버 오류:
 *   - 404 Not Found: 해당 유저 또는 리소스를 찾을 수 없음
 *   - 409 Conflict: lastModified 불일치 등 버전 충돌
 *   - 500 Internal Server Error: 서버 내부 처리 오류, DB 내부 오류
 *
 * 요청 경로 예시:
 *   DELETE /api/client/posts/by-session/abc123
 *
 * 요청 바디 예시:
 *   {
 *     "postId": "abc123",            // 경로 postId와 반드시 일치
 *     "userId": string,
 *     "[folderId]": string,
 *     "lastModified": "2024-05-28T01:23:45.678Z"
 *   }
 */
export const DELETE = auth(async function DELETE(req, { params }: { params: Promise<{ postId: string }> }): Promise<NextResponse<DeleteResBodyType>> {
    const authResult = await checkAuth(req);

    // authResult가 string이면 userId, 아니면 바로 응답 객체
    if (typeof authResult !== 'string') {
        return authResult; // jsonResponse 반환
    }

    const userId = authResult;
    const body = await req.json();

    const lastModified = body["lastModified"];
    delete body["lastModified"];

    const postId = (await params).postId;

    if (!isConvertibleToDate(lastModified) || !isShape(body, deleteInputShape) || body.postId !== postId) {
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
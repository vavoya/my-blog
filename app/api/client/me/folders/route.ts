import {NextResponse} from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import {checkAuth} from "@/app/api/_utils/checkAuth";
import postByUserId from "@/services/server/folder/postByUserId";
import {validateFolder} from "@/validation/server/folder/validateFolder"
import {isConvertibleToDate} from "@/utils/isConvertibleToDate";
import {ResBodyType} from "@/app/api/client/me/folders/type";
import {revalidateTag} from "next/cache";
import {auth} from "@/auth";

/**
 * POST /api/client/folders-info/by-session
 *
 * 사용자 세션 기반으로 새로운 폴더를 생성한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @returns {Promise<Response>} - API 응답 객체
 *
 * 성공 시:
 *   - 200 OK
 * 클라이언트 오류:
 *   - 400 Bad Request: 입력 데이터 유효성 검사 실패
 *   - 401 Unauthorized: 인증 실패 (checkAuth 내부 처리)
 * 서버 오류:
 *   - 404 Not Found: 유저 정보 또는 관련 리소스를 찾을 수 없음
 *   - 409 Conflict: 버전 충돌
 *   - 500 Internal Server Error: 서버 내부 처리 오류 발생
 *
 * 요청 바디 예시: todo: 폴더로 고치기
 * {
 *   "postName": "제목",
 *   "postContent": "내용",
 *   "postDescription": "설명",
 *   "thumbUrl": "썸네일 URL",
 *   "[folderId]": "폴더 ID",
 *   "lastModified": "2024-05-29T00:00:00.000Z" // ISO8601 문자열, 필수
 * }
 */
export const POST =  auth(async function POST(req): Promise<NextResponse<ResBodyType>> {
    const authResult = await checkAuth(req);

    // authResult가 string이면 userId, 아니면 바로 응답 객체
    if (typeof authResult !== 'string') {
        return authResult; // jsonResponse 반환
    }

    const userId = authResult;
    const body = await req.json();

    const lastModified = body["lastModified"];
    delete body["lastModified"];

    if (!isConvertibleToDate(lastModified) || !validateFolder(body)) {
        return jsonResponse(response.badRequest('입력 데이터가 유효하지 않습니다.'));
    }

    // 일단 한번 더 넣기.
    body.userId = userId;

    try {
        const results = await postByUserId({
            ...body,
            lastModified
        });

        if (results.success) {
            revalidateTag(`${userId}`);
            return jsonResponse(response.ok({
                folderId: results.data.folderId.toString(),
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
            case "InsertFailed":
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

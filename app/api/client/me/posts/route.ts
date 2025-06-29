import {NextResponse} from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import {checkAuth} from "@/app/api/_utils/checkAuth";
import postByUserId from "@/services/server/post/postByUserId";
import {isConvertibleToDate} from "@/utils/isConvertibleToDate";
import {ResBodyType} from "@/app/api/client/me/posts/type";
import {validatePost} from "@/validation/server/post/validatePost";
import {revalidateTag} from "next/cache";
import {auth} from "@/auth";

/**
 * POST /api/client/me/posts
 *
 * 인증된 사용자의 새로운 포스트를 생성한다.
 * 제목, 내용, 설명, 썸네일 URL, 폴더 ID 등의 정보를 포함하여 포스트를 생성한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @returns {Promise<NextResponse<ResBodyType>>} - API 응답 객체
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
 * POST /api/client/me/posts
 * {
 *   "postName": "제목",
 *   "postContent": "내용",
 *   "postDescription": "설명",
 *   "thumbUrl": "썸네일 URL",
 *   "folderId": "폴더 ID",
 *   "lastModified": "2024-05-28T01:23:45.678Z"
 * }
 * ```
 */
export const POST = auth(async function POST(req): Promise<NextResponse<ResBodyType>> {
    const authResult = await checkAuth(req);

    // authResult가 string이면 userId, 아니면 바로 응답 객체
    if (typeof authResult !== 'string') {
        return authResult; // jsonResponse 반환
    }

    const userId = authResult;
    const body = await req.json();

    const lastModified = body["lastModified"];
    delete body["lastModified"];

    if (!isConvertibleToDate(lastModified) || !validatePost(body)) {
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

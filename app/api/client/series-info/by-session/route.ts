import {NextRequest, NextResponse} from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import {checkAuth} from "@/app/api/_utils/checkAuth";
import {isConvertibleToDate} from "@/utils/isConvertibleToDate";
import {ResBodyType} from "@/app/api/client/series-info/by-session/type";
import {revalidateTag} from "next/cache";
import postByUserId from "@/services/server/series/postByUserId/postByUserId";
import {validateSeries} from "@/validation/server/series/validateSeries";

/**
 * POST /api/client/series-info/by-session
 *
 * 사용자 세션 기반으로 새로운 시리즈를 생성한다.
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
 *   - 409 Conflict: 버전 충돌
 *   - 500 Internal Server Error: 서버 내부 처리 오류 발생
 *
 * 요청 바디 예시: todo: 폴더로 고치기
 * {
 *   "userId": "유저 아이디", (근데 어차피 auth 걸로 대체)
 *   "seriesName": "제목",
 *   "lastModified": "2024-05-29T00:00:00.000Z" // ISO8601 문자열, 필수
 * }
 */
export async function POST(req: NextRequest): Promise<NextResponse<ResBodyType>> {
    const authResult = await checkAuth();

    // authResult가 string이면 userId, 아니면 바로 응답 객체
    if (typeof authResult !== 'string') {
        return authResult; // jsonResponse 반환
    }

    const userId = authResult;
    const body = await req.json();

    const lastModified = body["lastModified"];
    delete body["lastModified"];

    if (!isConvertibleToDate(lastModified) || !validateSeries(body)) {
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
                seriesId: results.data.seriesId.toString(),
                createdAt: results.data.createdAt.toISOString(),
                updatedAt: results.data.updatedAt.toISOString(),
                lastModified: results.data.lastModified.toISOString()
            }));
        }

        switch (results.error) {
            case "LastModifiedMismatch":
                return jsonResponse(response.conflict(results.message));
            case "UserNotFound":
                return jsonResponse(response.notFound(results.message));
            case "InsertFailed":
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

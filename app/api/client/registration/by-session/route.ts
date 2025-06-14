import {NextRequest, NextResponse} from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import {ResBodyType} from "@/app/api/client/registration/by-session/type";
import createByAuthId from "@/services/server/registration/createByAuthId/createByAuthId";
import {auth} from "@/auth";
import {validateRegister} from "@/validation/server/regist/validateRegister";
import {revalidateTag} from "next/cache";


/**
 * POST /api/client/registration/by-session
 *
 * 세션 기반 사용자 정보를 바탕으로 신규 등록(회원 생성 또는 블로그 사용자 등록)을 수행합니다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @returns {Promise<NextResponse<ResBodyType>>} - JSON 형태의 API 응답
 *
 * 요청 본문(JSON):
 * {
 *   "postName": "제목",
 *   "postContent": "본문",
 *   "postDescription": "설명",
 *   "thumbUrl": "썸네일 이미지 URL",
 *   "folderId": "소속 폴더 ID"
 * }
 * ※ userId는 세션에서 자동 추출되므로 요청에 포함하지 않음
 *
 * 응답 종류:
 *   - 200 OK: 등록 성공
 *   - 400 Bad Request: 입력 데이터 유효성 실패
 *   - 401 Unauthorized: 인증 세션 없음
 *   - 404 Not Found: 폴더 또는 사용자 정보 없음
 *   - 409 Conflict: 요청 시점의 데이터 버전 충돌
 *   - 500 Internal Server Error: 데이터 삽입 또는 트랜잭션 처리 중 서버 오류
 *
 * 내부 처리 흐름:
 *   1. 세션 인증 (`auth()`) → 인증 실패 시 401
 *   2. 요청 바디 유효성 검사 → 실패 시 400
 *   3. createByAuthId() 호출 → 상황별 오류 분기 및 메시지 전송
 */
export async function POST(req: NextRequest): Promise<NextResponse<ResBodyType>> {
    /*
    if (req) {}
    return jsonResponse(response.forbidden("회원가입은 현재 비활성화되어 있습니다."))

     */


    const session = await auth()

    if (!session) {
        return jsonResponse(response.unauthorized('인증 오류1: 인증 정보가 없습니다.'));
    }

    const body = await req.json();

    if (!validateRegister(body)) {
        return jsonResponse(response.badRequest('입력 데이터가 유효하지 않습니다.'));
    }

    try {
        const results = await createByAuthId({
            ...body,
            authId: `${session.provider}_${session.providerAccountId}`,
            email: session.user ? session.user.email ? session.user.email : "" : "",
        });

        if (results.success) {
            revalidateTag(`${session.userId}`);
            return jsonResponse(response.ok(true))
        }

        switch (results.error) {
            case "AlreadyRegistered":
                return jsonResponse(response.conflict(results.message));
            case "RegistrationFailed":
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

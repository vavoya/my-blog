import {NextResponse} from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import {ResBodyType} from "@/app/api/client/me/registration/type";
import createByAuthId from "@/services/server/registration/createByAuthId";
import {auth} from "@/auth";
import {validateRegister} from "@/validation/server/regist/validateRegister";
import {revalidateTag} from "next/cache";


/**
 * PATCH /api/client/me/registration
 *
 * 인증된 사용자의 회원 정보를 부분 수정한다.
 * 블로그 이름, 사용자 이름, 블로그 URL 등의 정보를 수정할 수 있다.
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
 * PATCH /api/client/me/registration 
 * {
 *   "name": "새 이름",
 *   "blogName": "새 블로그 이름",
 *   "blogUrl": "새 블로그 URL",
 *   "lastModified": "2024-05-28T01:23:45.678Z"
 * }
 * ```
 */
export const POST = auth(async function POST(req): Promise<NextResponse<ResBodyType>> {
    const session = req.auth;

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
            authId: session.authId,
            email: session.user ? session.user.email ? session.user.email : "" : "",
        });

        if (results.success) {
            revalidateTag(`${session.userId}`);
            return jsonResponse(response.ok(true))
        }

        switch (results.error) {
            case "BannedUser":
            case "SignupDisabled":
                return jsonResponse(response.forbidden(results.message));
            case "AlreadyRegistered":
            case "BlogAlreadyExists":
                return jsonResponse(response.conflict(results.message));
            case "RegistrationFailed":
            case "TransactionError":
                return jsonResponse(response.error(results.message)); // 500 Internal Server Error
            default:
                return jsonResponse(response.error('알 수 없는 오류가 발생했습니다.'));
        }
    } catch (e) {
        console.error(e);
        return jsonResponse(response.error('서버 오류: 회원 등록을 처리하는 중 문제가 발생했습니다.'));
    }

})
import { response } from "@/app/api/_utils/createResponse";
import {jsonResponse} from "@/app/api/server/jsonResponse";
import findUserIdAndUpdateLoginByAuthId from "@/data-access/user-info/findUserIdAndUpdateLoginByAuthId";
import {NextRequest} from "next/server";
import validateAndTransform from "@/app/api/validateAndTransform";
import getUserInfoByBlogUrl from "@/data-access/user-info/getUserInfoByBlogUrl";

/**
 * GET /api/server/users
 *
 * 주어진 조건에 맞는 사용자 정보를 조회한다.
 * auth-id 또는 blog-url 중 하나의 쿼리 파라미터를 통해 사용자를 검색할 수 있다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @returns {Promise<Response>} - API 응답 객체
 *
 * 성공 시:
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "userId": "사용자ID",
 *     "email": "이메일",
 *     "name": "이름",
 *     "blogUrl": "블로그URL"
 *   }
 * }
 * ```
 *
 * 클라이언트 오류:
 * ```json
 * {
 *   "status": 400,
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
 * ```
 * GET /api/server/users?auth-id=abc123
 * ```
 * 또는
 * ```
 * GET /api/server/users?blog-url=myblog.com
 * ```
 */
export async function GET(req: NextRequest): Promise<Response> {
    const searchParams = req.nextUrl.searchParams;
    let authId = searchParams.get('auth-id');
    let blogUrl = searchParams.get('blog-url');

    if (authId) {
        try {
            authId = validateAndTransform(authId, 'string');
        } catch {
            return jsonResponse(response.badRequest('authid 파라미터가 유효하지 않습니다.'))
        }
    }

    if (blogUrl) {
        try {
            blogUrl = validateAndTransform(blogUrl, 'string');
        } catch {
            return jsonResponse(response.badRequest('authid 파라미터가 유효하지 않습니다.'))
        }
    }


    try {
        let result = null
        if (authId) {
            result = await findUserIdAndUpdateLoginByAuthId(authId)
        } else if (blogUrl) {
            result = await getUserInfoByBlogUrl(blogUrl);
        }

        if (!result) {
            return jsonResponse(response.notFound('유저 정보가 없습니다.'));
        }

        return jsonResponse(response.ok(result));
    } catch {

        return jsonResponse(response.error('서버 오류: 유저 정보를 불러오는 중 문제가 발생했습니다.'));
    }
}

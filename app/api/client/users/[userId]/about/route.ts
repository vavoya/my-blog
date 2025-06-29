import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import validateAndTransform from "@/app/api/validateAndTransform";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import findOneAboutInfoByUserId from "@/data-access/about-info/findOneAboutInfoByUserId";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";

type Params = Promise<{
    userId: UserInfoResponse['_id'];
}>

/**
 * GET /api/client/users/[userId]/about
 *
 * 사용자의 소개글 정보를 조회한다.
 * 경로 파라미터로 전달된 userId에 해당하는 사용자의 소개글 정보를 조회한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @param {Object} params - 경로 파라미터 객체
 * @param {string} params.userId - 조회할 사용자의 고유 ID (MongoDB ObjectId 문자열)
 * @returns {Promise<NextResponse>} - API 응답 객체
 *
 * 성공 시:
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     // 소개글 정보 객체
 *   }
 * }
 * ```
 *
 * 클라이언트 오류:
 * ```json
 * {
 *   "status": 400,
 *   "message": "userId 파라미터가 유효하지 않습니다."
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
 * GET /api/client/users/507f1f77bcf86cd799439011/about
 * ```
 */
export async function GET(req: NextRequest, { params }: { params: Params }): Promise<Response> {
    let { userId } = await params;

    try {
        userId = validateAndTransform(userId, 'string');
    } catch {
        return jsonResponse(response.badRequest('userid 파라미터가 유효하지 않습니다.'))
    }

    try {
        const result = await findOneAboutInfoByUserId(new ObjectId(userId));
        if (!result) {
            return jsonResponse(response.notFound('소개글 정보가 없습니다.'));
        }

        return jsonResponse(response.ok(result));
    } catch (e) {
        console.error(e);

        return jsonResponse(response.error('서버 오류: 포스트 정보를 불러오는 중 문제가 발생했습니다.'));
    }
}

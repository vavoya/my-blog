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
 * GET /api/client/about/by-userId
 *
 * 사용자 ID(`userid`)를 기준으로 소개글 정보를 조회합니다.
 *
 * @param {NextRequest} req - Next.js에서 전달되는 HTTP 요청 객체
 * @param params
 * @returns {Promise<Response>} - 소개글 정보에 대한 응답
 *
 * - 성공 시: `200 OK`와 소개글 데이터
 * - 잘못된 쿼리 파라미터: `400 Bad Request`
 * - 소개글 정보 없음: `404 Not Found`
 * - 내부 서버 오류: `500 Internal Server Error`
 *
 * @queryparam {string} userid - 사용자 ID (MongoDB ObjectId 문자열)
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

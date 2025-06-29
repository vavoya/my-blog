import getFolderInfosByUserId from "@/data-access/folder-info/getFolderInfosByUserId";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import validateAndTransform from "@/app/api/validateAndTransform";
import {jsonResponse} from "@/app/api/server/jsonResponse";

type Params = Promise<{
    userId: string;
}>

/**
 * GET /api/server/users/[userId]/folders
 *
 * 특정 사용자가 소유한 폴더 정보 목록을 조회한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @param {Object} params - 경로 파라미터 객체
 * @param {string} params.userId - 조회할 사용자의 고유 ID (ObjectId 문자열)
 * @returns {Promise<Response>} - API 응답 객체
 *
 * 성공 시:
 * ```json
 * {
 *   "status": 200,
 *   "data": [
 *     {
 *       "id": "폴더ID",
 *       "name": "폴더이름",
 *       "parentFolderId": "부모폴더ID",
 *       "createdAt": "생성일시",
 *       "lastModified": "수정일시"
 *     },
 *     ...
 *   ]
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
 */
export async function GET(req: NextRequest, { params }: { params: Params }): Promise<Response> {
    let { userId } = await params;

    try {
        userId = validateAndTransform(userId, 'string');
    } catch {
        return jsonResponse(response.badRequest('user-id 파라미터가 유효하지 않습니다.'))
    }

    try {
        const results = await getFolderInfosByUserId(new ObjectId(userId));

        if (!results || results.length === 0) {
            return jsonResponse(response.notFound('폴더 정보가 없습니다.'));
        }

        return jsonResponse(response.ok(results));
    } catch (e) {
        console.error(e);

        return jsonResponse(response.error('서버 오류: 폴더 정보를 불러오는 중 문제가 발생했습니다.'));
    }
}

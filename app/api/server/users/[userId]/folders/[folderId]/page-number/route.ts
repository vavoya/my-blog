import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import validateAndTransform from "@/app/api/validateAndTransform";
import {jsonResponse} from "@/app/api/server/jsonResponse";
import getByFolderId from "@/data-access/pagination/page-num/getByFolderId";

type Params = Promise<{
    userId: string;
    folderId: string;
}>

/**
 * GET /api/server/users/[userId]/folders/[folderId]/page-number
 *
 * 특정 폴더 내에서 주어진 포스트가 최신순 정렬 기준으로 몇 번째 페이지에 있는지 조회한다.
 * 포스트 ID를 쿼리 파라미터로 받아서 해당 포스트가 폴더 내의 몇 번째 페이지에 위치하는지 반환한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @param {Object} params - 경로 파라미터 객체
 * @param {string} params.userId - 사용자의 고유 ID
 * @param {string} params.folderId - 조회할 폴더의 고유 ID
 * @returns {Promise<NextResponse>} - API 응답 객체
 *
 * 성공 시:
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "pageNumber": 1
 *   }
 * }
 * ```
 *
 * 클라이언트 오류:
 * ```json
 * {
 *   "status": 400,
 *   "message": "파라미터가 유효하지 않습니다"
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
 * GET /api/server/users/123/folders/456/page-number?post-id=789
 * ```
 */
export async function GET(req: NextRequest, { params }: { params: Params}): Promise<Response> {
    const searchParams = req.nextUrl.searchParams;
    let { userId, folderId } = await params;
    let postId = searchParams.get('post-id');

    try {
        userId = validateAndTransform(userId, 'string');
    } catch {
        return jsonResponse(response.badRequest('userid 파라미터가 유효하지 않습니다.'))
    }

    try {
        folderId = validateAndTransform(folderId, 'string');
    } catch {
        return jsonResponse(response.badRequest('folderid 파라미터가 유효하지 않습니다.'))
    }

    try {
        postId = validateAndTransform(postId, 'string');
    } catch {
        return jsonResponse(response.badRequest('postid 파라미터가 유효하지 않습니다.'))
    }

    try {
        const results = await getByFolderId(new ObjectId(userId), new ObjectId(folderId), new ObjectId(postId));
        if (!results) {
            return jsonResponse(response.notFound('포스트의 페이지 정보가 없습니다.'));
        }

        return jsonResponse(response.ok(results));
    } catch (e) {
        console.error(e);

        return jsonResponse(response.error('서버 오류: 포스트의 페이지 정보를 불러오는 중 문제가 발생했습니다.'));
    }
}

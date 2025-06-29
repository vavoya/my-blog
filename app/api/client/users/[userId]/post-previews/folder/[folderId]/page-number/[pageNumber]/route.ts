import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import validateAndTransform from "@/app/api/validateAndTransform";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import getPaginatedPostsByFolderId from "@/data-access/post-info/getPaginatedPostsByFolderId";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";

type Params = Promise<{
    userId: UserInfoResponse['_id'];
    folderId: FolderInfoResponse['_id'];
    pageNumber: string | number;
}>

/**
 * GET /api/client/users/[userId]/post-previews/folder/[folderId]/page-number/[pageNumber]
 *
 * 특정 사용자의 특정 폴더에 있는 포스트 목록을 페이지네이션하여 조회한다.
 *
 * @param {NextRequest} req - Next.js API 요청 객체
 * @param {Object} params - 경로 파라미터 객체
 * @param {string} params.userId - 사용자의 고유 ID (MongoDB ObjectId)
 * @param {string} params.folderId - 폴더의 고유 ID (MongoDB ObjectId)
 * @param {string|number} params.pageNumber - 조회할 페이지 번호 (1부터 시작)
 * @returns {Promise<NextResponse>} - API 응답 객체
 *
 * 성공 시:
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "posts": [
 *       {
 *         "id": "포스트ID",
 *         "title": "제목",
 *         "summary": "요약",
 *         "thumbnail": "썸네일URL",
 *         "createdAt": "생성일시"
 *       }
 *     ],
 *     "totalPages": 10,
 *     "currentPage": 1
 *   }
 * }
 * ```
 *
 * 클라이언트 오류:
 * ```json
 * {
 *   "status": 400,
 *   "message": "userid|folderid|page-number 파라미터가 유효하지 않습니다."
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
 * GET /api/client/users/abc123/post-previews/folder/def456/page-number/1
 * ```
 */
export async function GET(req: NextRequest, { params }: { params: Params}): Promise<Response> {
    let { userId, folderId, pageNumber } = await params;

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
        pageNumber = validateAndTransform(pageNumber as string, 'number');
        if (pageNumber <= 0) {
            throw Error()
        }
    } catch {
        return jsonResponse(response.badRequest('page-number 파라미터가 유효하지 않습니다.'))
    }

    try {
        const results = await getPaginatedPostsByFolderId(new ObjectId(userId), new ObjectId(folderId), pageNumber);
        if (!results) {
            return jsonResponse(response.notFound('페이지 정보가 없습니다.'));
        }

        return jsonResponse(response.ok(results));
    } catch (e) {
        console.error(e);

        return jsonResponse(response.error('서버 오류: 페이지 정보를 불러오는 중 문제가 발생했습니다.'));
    }
}

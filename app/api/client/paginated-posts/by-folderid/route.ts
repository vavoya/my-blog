import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import validateAndTransform from "@/app/api/validateAndTransform";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import getPaginatedPostsByFolderId from "@/models/post_info/getPaginatedPostsByFolderId";

/**
 * GET /api/client/paginated-posts/by-folderid
 *
 * 사용자 ID(`userid`), 폴더 ID(`folderid`), 페이지 번호(`pagenum`)를 기반으로
 * 해당 폴더의 포스트 목록을 페이지네이션하여 조회합니다.
 *
 * @param {NextRequest} req - Next.js에서 전달되는 HTTP 요청 객체
 * @returns {Promise<Response>} - 포스트 목록 응답
 * - 성공 시: `200 OK`와 포스트 데이터 배열
 * - 잘못된 쿼리 파라미터: `400 Bad Request`
 * - 해당 페이지 또는 폴더 없음: `404 Not Found`
 * - 내부 서버 오류: `500 Internal Server Error`
 *
 * @queryparam {string} userid - 사용자 ID (ObjectId 문자열)
 * @queryparam {string} folderid - 폴더 ID (ObjectId 문자열)
 * @queryparam {number} pagenum - 1부터 시작하는 페이지 번호
 */
export async function GET(req: NextRequest): Promise<Response> {
    const searchParams = req.nextUrl.searchParams;
    let userId;
    let folderId;
    let pagenum;

    try {
        userId = validateAndTransform(searchParams.get('userid'), 'string');
    } catch {
        return jsonResponse(response.badRequest('userid 파라미터가 유효하지 않습니다.'))
    }

    try {
        folderId = validateAndTransform(searchParams.get('folderid'), 'string');
    } catch {
        return jsonResponse(response.badRequest('folderid 파라미터가 유효하지 않습니다.'))
    }

    try {
        pagenum = validateAndTransform(searchParams.get('pagenum'), 'number');
        if (pagenum <= 0) {
            throw Error()
        }
    } catch {
        return jsonResponse(response.badRequest('pagenum 파라미터가 유효하지 않습니다.'))
    }

    try {
        const results = await getPaginatedPostsByFolderId(new ObjectId(userId), new ObjectId(folderId), pagenum);
        if (!results) {
            return jsonResponse(response.notFound('페이지 정보가 없습니다.'));
        }

        return jsonResponse(response.ok(results));
    } catch (e) {
        console.error(e);

        return jsonResponse(response.error('서버 오류: 페이지 정보를 불러오는 중 문제가 발생했습니다.'));
    }
}

import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { response } from "@/app/api/_utils/createResponse";
import validateAndTransform from "@/app/api/validateAndTransform";
import {jsonResponse} from "@/app/api/server/jsonResponse";
import getByFolderId from "@/models/pagination/pageNum/getByFolderId";

export const route = '/api/server/pagenum/by-folderid'
/**
 * GET /api/server/pagenum/by-folderid
 *
 * 특정 폴더 내에서 주어진 포스트가 최신순 정렬 기준으로 몇 번째 페이지에 있는지 조회합니다.
 *
 * @param {NextRequest} req - Next.js에서 전달되는 HTTP 요청 객체
 * @returns {Promise<Response>} - 페이지 번호 응답
 * - 성공 시: `200 OK`와 `{ pageNumber: number }`
 * - 잘못된 쿼리 파라미터: `400 Bad Request`
 * - 해당 포스트가 폴더 내에 존재하지 않는 경우: `404 Not Found`
 * - 내부 서버 오류: `500 Internal Server Error`
 *
 * @queryparam {string} userid - 사용자 ID (ObjectId 문자열)
 * @queryparam {string} folderid - 폴더 ID (ObjectId 문자열)
 * @queryparam {string} postid - 포스트 ID (ObjectId 문자열)
 */

export async function GET(req: NextRequest): Promise<Response> {
    const searchParams = req.nextUrl.searchParams;
    let userId;
    let folderId;
    let postId;

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
        postId = validateAndTransform(searchParams.get('postid'), 'string');
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

import { revalidateTag } from 'next/cache'

/**
 * POST /api/server/revalidate/all
 *
 * Next.js의 revalidateTag를 사용하여 특정 태그와 관련된 모든 정적 데이터를 재검증한다.
 *
 * @param {Request} request - Request 객체
 * @returns {Promise<Response>} - API 응답 객체
 *
 * 성공 시:
 * ```
 * Response('OK', { status: 200 })
 * ```
 *
 * 클라이언트 오류:
 * ```
 * Response('BAD REQUEST', { status: 400 })
 * ```
 *
 * 요청 예시:
 * ```json
 * POST /api/server/revalidate/all
 * {
 *   "tag": "revalidate-tag"
 * }
 * ```
 */
export async function POST(request: Request) {

    const json = await request.json()
    const tag = json.tag
    if (typeof tag === 'string' && tag.trim().length > 0) {
        revalidateTag(tag.trim())
        return new Response('OK')
    } else {
        return new Response('BAD REQUEST', { status: 400 })
    }

}

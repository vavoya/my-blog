import { revalidateTag } from 'next/cache'

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

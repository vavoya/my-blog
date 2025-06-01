import { revalidateTag } from 'next/cache'

export async function POST() {
    revalidateTag('all')
    return new Response('OK')
}

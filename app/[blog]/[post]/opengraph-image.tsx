import { ImageResponse } from 'next/og'
import getByBlogUrl from "@/fetch/server/userInfo/getByBlogUrl";
import getByPostUrl from "@/fetch/server/postInfo/getByPostUrl";
import {Props} from "@/app/[blog]/[post]/page";

// Image metadata
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image({ params }: Props) {
    const pageParams = await params;
    const blog = decodeURIComponent(pageParams.blog)
    const post = decodeURIComponent(pageParams.post)

    const userInfoResponse = await getByBlogUrl(blog);
    if (userInfoResponse.status !== 200) {
        // layout에서 이미 걸러졌다고 가정하므로, 여기는 절대 실행되지 않아야 함
        return { };
    }

    const postInfoResponse = await getByPostUrl(userInfoResponse.data._id, post);

    if (postInfoResponse.status !== 200) {
        return { };
    }

    const ogImage = postInfoResponse.data.thumb_url.length === 0 ? (
        postInfoResponse.data.post_name
    ) : (
        <img
            src={postInfoResponse.data.thumb_url}
            alt="대표 이미지"
            width="1200"
            height="630"
            style={{ objectFit: 'cover' }}
        />
    )
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 128,
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {ogImage}
            </div>
        )
    )
}
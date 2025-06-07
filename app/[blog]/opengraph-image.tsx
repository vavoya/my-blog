import { ImageResponse } from 'next/og'
import {Props} from "@/app/[blog]/page";

// Image metadata
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image({ params }: Props) {
    const pageParams = await params;

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
                {pageParams.blog}
            </div>
        )
    )
}
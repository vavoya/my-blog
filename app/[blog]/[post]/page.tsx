import React from "react";
import getByBlogUrl from "@/fetch/server/users/getByBlogUrl";
import getByPostUrl from "@/fetch/server/posts/getByPostUrl";
import {renderPost} from "@/app/[blog]/[post]/_render/renderPost";
import SideBar from "@/components/sideBar/SideBar";
import {renderError} from "@/app/_error/renderError";
import styles from "@/app/[blog]/page.module.css";
import {Metadata} from "next";
import {DESCRIPTION_LIMIT, TITLE_LIMIT} from "@/const/meta";


export type Props = { params: Promise<{ blog: string, post: string }> }

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
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

    const title = `${postInfoResponse.data.post_name.substring(0, TITLE_LIMIT)} - sim-log`;
    const description = (postInfoResponse.data.post_description.trim().length === 0 ? postInfoResponse.data.post_content : postInfoResponse.data.post_description).substring(0, DESCRIPTION_LIMIT);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${blog}/${post}`,
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${blog}/${post}/opengraph-image`,
                    width: 1200,
                    height: 630,
                    alt: '대표 이미지',
                },
            ],
            type: 'website',
        },
    }
}

export default async function Page({ params }: Props) {
    const pageParams = await params;
    const blog = decodeURIComponent(pageParams.blog)
    const post = decodeURIComponent(pageParams.post)

    const userInfoResponse = await getByBlogUrl(blog);
    if (userInfoResponse.status !== 200) {
        // layout에서 이미 걸러졌다고 가정하므로, 여기는 절대 실행되지 않아야 함
        return null;
    }

    const blogUrl = `/${userInfoResponse.data.blog_url}`;
    const postInfoResponse = await getByPostUrl(userInfoResponse.data._id, post);

    const content =
        postInfoResponse.status === 200
            ? renderPost(postInfoResponse.data)
            : renderError(postInfoResponse.status, blogUrl);

    return (
        <>
            <SideBar url={{ blog, post }} userId={userInfoResponse.data._id} />
            <main className={styles.main}>
                {content}
            </main>
        </>
    );
}

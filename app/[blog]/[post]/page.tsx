import React from "react";
import getByBlogUrl from "@/fetch/server/userInfo/getByBlogUrl";
import getByPostUrl from "@/fetch/server/postInfo/getByPostUrl";
import {renderPost} from "@/app/[blog]/[post]/_render/renderPost";
import SideBar from "@/components/sideBar/SideBar";
import {renderError} from "@/app/_error/renderError";
import styles from "@/app/[blog]/page.module.css";

export default async function Page({ params }: { params: Promise<{ blog: string, post: string }> }) {
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

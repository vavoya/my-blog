import getByBlogUrl from "@/fetch/server/userInfo/getByBlogUrl";
import SideBar from "@/components/sideBar/SideBar";
import React from "react";
import getByUserId from "@/fetch/server/aboutInfo/getByUserId";
import {RootBlockNode} from "md-ast-parser";
import {AstRenderer} from "@/components/reactMarkdown/MarkdownRenderer";
import styles from "./page.module.css";

export default async function Page({params}: {params: Promise<{blog: string}>}) {
    // 블로그 이름에 따른 유저 정보 가져오기 (id, 블로그 이름)

    const pageParams = await params;
    const blog = decodeURIComponent(pageParams.blog);
    const userInfoResponse = await getByBlogUrl(blog);
    if (userInfoResponse.status !== 200) {
        // layout에서 이미 걸러졌다고 가정하므로, 여기는 절대 실행되지 않아야 함
        return null;
    }

    const aboutInfo = await getByUserId(userInfoResponse.data._id)
    if (aboutInfo.status !== 200) {
        return null;
    }

    return (
        <>
            <SideBar url={{blog}} userId={userInfoResponse.data._id} />
            <main className={styles.main}>
                <AstRenderer ast={aboutInfo.data.ast as RootBlockNode} />
            </main>
        </>
    )
}
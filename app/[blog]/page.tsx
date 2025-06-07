import getByBlogUrl from "@/fetch/server/userInfo/getByBlogUrl";
import SideBar from "@/components/sideBar/SideBar";
import React from "react";
import getByUserId from "@/fetch/server/aboutInfo/getByUserId";
import {RootBlockNode} from "md-ast-parser";
import {AstRenderer} from "@/components/reactMarkdown/MarkdownRenderer";
import styles from "./page.module.css";
import {Metadata} from "next";
import {DESCRIPTION_LIMIT, TITLE_LIMIT} from "@/const/meta";

export type Props = {params: Promise<{blog: string}>}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const pageParams = await params;
    const blog = decodeURIComponent(pageParams.blog);
    const userInfoResponse = await getByBlogUrl(blog);

    if (userInfoResponse.status !== 200) {
        // layout에서 이미 걸러졌다고 가정하므로, 여기는 절대 실행되지 않아야 함
        return {};
    }

    const aboutInfo = await getByUserId(userInfoResponse.data._id)
    if (aboutInfo.status !== 200) {
        return {}
    }

    const title = userInfoResponse.data.blog_name.substring(0, TITLE_LIMIT);
    const description = aboutInfo.data.content.substring(0, DESCRIPTION_LIMIT);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${blog}}`,
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${blog}/opengraph-image`,
                    width: 1200,
                    height: 630,
                    alt: '대표 이미지',
                },
            ],
            type: 'website',
        },
    }
}

export default async function Page({params}: Props) {
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
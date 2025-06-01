import React from "react";
import getByBlogUrl from "@/fetch/server/userInfo/getByBlogUrl";
import Header from "@/app/[blog]/_component/Header";
import {renderError} from "@/app/_error/renderError";

export default async function Layout({children, params}: {children: React.ReactNode, params: Promise<{blog: string}>}) {
    // 블로그 이름에 따른 유저 정보 가져오기 (id, 블로그 이름)
    const pageParams = await params;
    const blog = decodeURIComponent(pageParams.blog);
    const userInfoResponse = await getByBlogUrl(blog);

    if (userInfoResponse.status !== 200) {
        return JSON.stringify(userInfoResponse, null, 2);
        //return renderError(userInfoResponse.status, '/');
    }

    return (
        <>
            <Header blog={blog} blogName={userInfoResponse.data.blog_name} />
            {children}
        </>
    );
}
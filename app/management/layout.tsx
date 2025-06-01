import React from "react";
import Header from "@/app/[blog]/_component/Header";
import getBySession from "@/fetch/server/userInfo/getBySession";
import {redirect} from "next/navigation";


export default async function Layout({children}: {children: React.ReactNode}) {
    // 블로그 이름에 따른 유저 정보 가져오기 (id, 블로그 이름)
    // 로그인 정보에 따른 접근
    // 따라서 userId로 불러와야함
    const userInfoResponse = await getBySession()

    // 로그인 페이지로 보내버려
    if (userInfoResponse.status !== 200) {
        return redirect(`/login?redirectTo=/management`);
    }

    return (
        <>
            <Header blog={userInfoResponse.data.blog_url} blogName={userInfoResponse.data.blog_name} />
            {children}
        </>
    );
}
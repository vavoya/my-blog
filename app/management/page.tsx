'use server'

import getBySession from "@/fetch/server/users/getBySession";
import getFolderInfoByUserId from "@/fetch/server/folders/getByUserId";
import getSeriesInfoByUserId from "@/fetch/server/series/getByUserId";
import {redirect} from "next/navigation";
import Background from "@/app/management/_components/Background";

export default async function Page() {

    // 유저 정보 가져오기
    const userInfoResponse = await getBySession()
    // 로그인 페이지로 보내버려
    if (userInfoResponse.status !== 200) {
        return redirect(`/login?redirectTo=/management`);
    }
    const userId = userInfoResponse.data._id
    // 폴더 정보 가져오기
    const folderInfoResponse = await getFolderInfoByUserId(userId)
    // 시리즈 정보 가져오기
    const seriesInfoResponse = await getSeriesInfoByUserId(userId)
    if (seriesInfoResponse.status !== 200 || folderInfoResponse.status !== 200) {
        return redirect(`/login?redirectTo=/management`);
    }

    const userInfo = userInfoResponse.data;
    const seriesInfo = seriesInfoResponse.data;
    const folderInfo = folderInfoResponse.data;

    return (
        <Background userInfo={userInfo} folderInfo={folderInfo} seriesInfo={seriesInfo}/>
    )
}
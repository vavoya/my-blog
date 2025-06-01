
import React from "react";
import {NavButton} from "@/components/sideBar/series/NavButton";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Url} from "@/components/sideBar/types";
import seriesInfoGetByUserId from "@/fetch/server/seriesInfo/getByUserId";
import folderInfoGetByUserId from "@/fetch/server/folderInfo/getByUserId";
import getByPostUrl from "@/fetch/server/postInfo/getByPostUrl";
import FallBackButton from "@/components/sideBar/folder/FallBackNavButton";
import {LIMIT} from "@/const/page";


export default async function DataProvider({url, userId}: {
    url: Url
    userId: UserInfoResponse['_id']
}) {
    let seriesId = null;
    let pageNumber = 1;
    let seriesInfo;
    let folderInfo;

    try {
        const folderRes = await folderInfoGetByUserId(userId);
        if (folderRes.status !== 200) throw new Error('folder fetch failed');
        folderInfo = folderRes.data;

        const seriesRes = await seriesInfoGetByUserId(userId);
        if (seriesRes.status !== 200) throw new Error('series fetch failed');
        seriesInfo = seriesRes.data;

        // 여기부터는 에러 처리할 필요가 없다.
        // 디폴트 값을 쓰면 되기 때문에
        if (url.post) {
            const postRes = await getByPostUrl(userId, url.post);
            if (postRes.status === 200) {
                const postId = postRes.data._id;

                const series = seriesInfo.find(({post_list}) => post_list.includes(postId));
                if (series) {
                    seriesId = series._id;

                    const postIndex = series.post_list.findIndex(id => id === postId);
                    pageNumber = Math.ceil((postIndex + 1) / LIMIT);
                }
            }
        }


    } catch (e) {
        console.error('[DataProvider Error]', e);
        return <FallBackButton />;
    }


    return (
        <NavButton
            userId={userId}
            url={url}
            initPageNumber={pageNumber}
            initSeriesId={seriesId}
            seriesInfo={seriesInfo}
            folderInfo={folderInfo}/>
    )
}


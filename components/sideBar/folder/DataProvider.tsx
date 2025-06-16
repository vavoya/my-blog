
import React from "react";
import {NavButton} from "@/components/sideBar/folder/NavButton";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Url} from "@/components/sideBar/types";
import getByUserId from "@/fetch/server/folders/getByUserId";
import getByPostUrl from "@/fetch/server/posts/getByPostUrl";
import FallBackButton from "@/components/sideBar/folder/FallBackNavButton";
import getByFolderId from "@/fetch/server/page-number/getByFolderId";


export default async function DataProvider({url, userId}: {
    url: Url
    userId: UserInfoResponse['_id']
}) {
    let folderId;
    let pageNumber = 1;
    let folderInfo;

    try {
        const folderRes = await getByUserId(userId);
        if (folderRes.status !== 200) throw new Error('folders fetch failed');
        folderInfo = folderRes.data;

        folderId = folderRes.data.find(({ pfolder_id }) => !pfolder_id)?._id;
        if (!folderId) throw new Error('no root folders found');

        // 여기부터는 에러 처리할 필요가 없다.
        // 디폴트 값을 쓰면 되기 때문에
        if (url.post) {
            const postRes = await getByPostUrl(userId, url.post);
            if (postRes.status === 200) {
                const postId = postRes.data._id;
                folderId = postRes.data.folder_id;

                const pageRes = await getByFolderId(userId, folderId, postId);
                if (pageRes.status == 200) {
                    pageNumber = pageRes.data.pageNumber;
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
            initFolderId={folderId}
            folderInfo={folderInfo} />
    )
}


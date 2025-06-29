import React, {useMemo, useState} from "react";

// components
import ModalLayout from "@/components/modal/components/ModalLayout";

// types
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import NavHeader from "@/components/modal/folder/NavHeader";
import NavBody from "@/components/modal/folder/NavBody";
import CardSection from "@/components/modal/management-folder-modal/CardSection";
import {FolderObj} from "@/components/modal/utils/toObj";
import {buildFolderPathIds} from "@/utils/buildFolderPathIds";
import {PaginatedPostsResponse} from "@/data-access/post-info/types";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import {useQueryClient} from "@tanstack/react-query";

// Modal 컴포넌트의 props 타입 정의
type ModalProps = {
    userId: UserInfoResponse['_id'];
    folderObj: FolderObj;
    seriesId: SeriesInfoResponse['_id'];
    setPost: (post: PaginatedPostsResponse) => void;
    closeModal: () => void;
}

export default function Modal({userId, folderObj, seriesId, setPost, closeModal}: ModalProps) {
    const folderInfo = useMemo(() => Object.values(folderObj), [folderObj])
    const rootFolderId = folderInfo.find(folder => folder.pfolder_id === null)!._id;
    const [ folderPath, setFolderPath ] = useState<FolderInfoResponse['_id'][]>(buildFolderPathIds(rootFolderId, folderObj))
    const queryClient = useQueryClient();

    return (
        <ModalLayout
            queryClient={queryClient}
            closeModal={closeModal}
            NavHeader={<NavHeader folderPath={folderPath} setFolderPath={setFolderPath} />}
            NavBody={<NavBody folderInfo={folderInfo} folderPath={folderPath} setFolderPath={setFolderPath} />}
            CardSection={<CardSection userId={userId} seriesId={seriesId} folderObj={folderObj} folderPath={folderPath} initPageNumber={1} setPost={setPost}/>} />
    )
}




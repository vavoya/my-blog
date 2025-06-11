import React, {useState} from "react";

// _components
import ModalLayout from "@/components/modal/components/ModalLayout";

// types
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Url} from "@/components/sideBar/types";
import {PageNumberResult} from "@/models/pagination/pageNum/type";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import NavHeader from "@/components/modal/folder/NavHeader";
import NavBody from "@/components/modal/folder/NavBody";
import CardSection from "@/components/modal/folder/CardSection";
import {toObj} from "@/components/modal/utils/toObj";
import {buildFolderPathIds} from "@/utils/buildFolderPathIds";

import queryClient from "@/components/modal/_queries";

// Modal 컴포넌트의 props 타입 정의
type ModalProps = {
    userId: UserInfoResponse['_id'];
    url: Url;
    initPageNumber: PageNumberResult['pageNumber'];
    initFolderId: FolderInfoResponse['_id'];
    folderInfo: FolderInfoResponse[];
    closeModal: () => void;
}

export default function Modal({userId, url, initPageNumber, initFolderId, folderInfo, closeModal}: ModalProps) {
    const folderObj = toObj(folderInfo)
    const [ folderPath, setFolderPath ] = useState<FolderInfoResponse['_id'][]>(buildFolderPathIds(initFolderId, folderObj))

    return (
        <ModalLayout
            queryClient={queryClient}
            closeModal={closeModal}
            NavHeader={<NavHeader folderPath={folderPath} setFolderPath={setFolderPath} />}
            NavBody={<NavBody folderInfo={folderInfo} folderPath={folderPath} setFolderPath={setFolderPath} />}
            CardSection={<CardSection userId={userId} url={url} folderObj={folderObj} folderPath={folderPath} initPageNumber={initPageNumber}/>} />
    )
}




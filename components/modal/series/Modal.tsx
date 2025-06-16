import {useState} from "react";

import queryClient from "@/components/modal/_queries";

// _components
import ModalLayout from "@/components/modal/components/ModalLayout";
import NavHeader from "@/components/modal/series/NavHeader";
import NavBody from "@/components/modal/series/NavBody";
import CardSection from "@/components/modal/series/CardSection";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Url} from "@/components/sideBar/types";
import {PageNumberResult} from "@/data-access/pagination/page-num/type";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import {toObj} from "@/components/modal/utils/toObj";

// Modal 컴포넌트의 props 타입 정의
export type ModalProps = {
    userId: UserInfoResponse['_id'];
    url: Url;
    initPageNumber: PageNumberResult['pageNumber'];
    initSeriesId: SeriesInfoResponse['_id'] | null;
    seriesInfo: SeriesInfoResponse[];
    folderInfo: FolderInfoResponse[];
    closeModal: () => void;
}
export default function Modal({userId, url, initPageNumber, initSeriesId, seriesInfo, folderInfo, closeModal}: ModalProps) {
    const [ seriesId, setSeriesId ] = useState(initSeriesId)
    const seriesObj = toObj(seriesInfo)
    const folderObj = toObj(folderInfo)

    return (
        <ModalLayout
            queryClient={queryClient}
            closeModal={closeModal}
            NavHeader={<NavHeader />}
            NavBody={<NavBody seriesInfo={seriesInfo} seriesId={seriesId} setSeriesId={setSeriesId}/>}
            CardSection={
            <CardSection userId={userId} url={url} folderObj={folderObj} seriesObj={seriesObj} seriesId={seriesId} initPageNumber={initPageNumber}/>}
        />
    )
}




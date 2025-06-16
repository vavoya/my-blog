import {useEffect, useMemo, useRef, useState} from "react";
import styles from "@/components/modal/components/modal.module.scss";
import Pagination from "@/components/modal/components/Pagination";
import PaginationSearch from "@/components/modal/components/PaginationSearch";
import CardBody from "@/components/modal/series/CardBody";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Url} from "@/components/sideBar/types";
import {PageNumberResult} from "@/data-access/pagination/page-num/type";
import {FolderObj, SeriesObj} from "@/components/modal/utils/toObj";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import {LIMIT} from "@/const/page";
import {usePaginatedPostIdsQuery} from "@/hook/usePaginatedPostIdsQuery";

type CardSectionProps = {
    userId: UserInfoResponse['_id'];
    url: Url;
    folderObj: FolderObj;
    seriesObj: SeriesObj;
    seriesId: SeriesInfoResponse['_id'] | null;
    initPageNumber: PageNumberResult['pageNumber'];
}

export default function CardSection({userId, url, folderObj, seriesObj, seriesId, initPageNumber}: CardSectionProps) {
    const [pageNumber, setPageNumber] = useState(initPageNumber);
    const prevSeriesId = useRef(seriesId);

    const postIds = useMemo(() => {
        return (!!seriesId ? seriesObj[seriesId].post_list : []).slice(0, LIMIT * pageNumber);
    }, [pageNumber, seriesId, seriesObj])
    const { isFetching, data, isError, errorMessage } = usePaginatedPostIdsQuery(userId, postIds);

    useEffect(() => {
        // 시리즈 변경
        if (seriesId !== prevSeriesId.current) {
            setPageNumber(1);
        }
        prevSeriesId.current = seriesId;
    }, [seriesId]);

    if (seriesId) {
        const postCount = seriesObj[seriesId].post_list.length;
        const maxPageNumber = Math.ceil(postCount / 12);
        return (
            <div className={styles.modalCardSection}>
                <div className={styles.modalCardHeader}>
                    <span>
                        {seriesObj[seriesId].series_name}
                    </span>
                    <span>
                        {postCount} 개의 글 | {maxPageNumber} 페이지</span>
                    <span>{seriesObj[seriesId].series_description}</span>
                </div>
                <CardBody
                    isLoading={isFetching}
                    isError={isError}
                    errorMessage={errorMessage}
                    postCount={postCount}
                    url={url}
                    series={seriesObj[seriesId]}
                    folderObj={folderObj}
                    paginatedPosts={data}/>
                <div className={styles.modalCardFooter}>
                    <Pagination
                        getPaginatedPosts={(pageNumber) => setPageNumber(pageNumber)}
                        pageNum={pageNumber}
                        maxPageNum={maxPageNumber}/>
                    <PaginationSearch
                        getPaginatedPosts={(pageNumber) => setPageNumber(pageNumber)}
                        maxPageNum={maxPageNumber}/>
                </div>
            </div>
        )
    } else {
        return (
            <div className={styles.modalCardSection}>
                <div className={styles.modalCardHeader}>
                    <span>
                        시리즈를 선택하세요
                    </span>
                </div>
            </div>
        )
    }
}
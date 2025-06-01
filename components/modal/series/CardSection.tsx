import {useCallback, useEffect, useRef, useState, useTransition} from "react";
import styles from "@/components/modal/components/modal.module.scss";
import Pagination from "@/components/modal/components/Pagination";
import PaginationSearch from "@/components/modal/components/PaginationSearch";
import CardBody from "@/components/modal/series/CardBody";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Url} from "@/components/sideBar/types";
import {PageNumberResult} from "@/models/pagination/pageNum/type";
import getByPostIds from "@/fetch/client/paginatedPost/getByPostIds";
import {PaginatedPostsResponse} from "@/models/post_info/types";
import {FolderObj, SeriesObj} from "@/components/modal/utils/toObj";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import {LIMIT} from "@/const/page";

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
    const [paginatedPosts, setPaginatedPosts] = useState<PaginatedPostsResponse[]>([]);
    const [isLoading, startTransition] = useTransition();
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const prevSeriesId = useRef(seriesId);

    const getPaginatedPosts = useCallback((pageNumber: PageNumberResult['pageNumber'], seriesId: SeriesInfoResponse['_id']) => {

        setPageNumber(pageNumber);
        startTransition(async () => {
            const postIds = seriesObj[seriesId].post_list.slice((pageNumber - 1) * LIMIT, pageNumber * LIMIT);
            const result = await getByPostIds(userId, postIds);

            if (result.status === 200) {
                setIsError(false);
                setPaginatedPosts(result.data);
            } else {
                setIsError(true);
                setErrorMessage(result.message);
            }
        })
    }, [seriesObj, userId]);

    useEffect(() => {
        if (!seriesId) {
            setPaginatedPosts([]);
        } else if (seriesId !== prevSeriesId.current) {
            getPaginatedPosts(1, seriesId);
        } else {
            getPaginatedPosts(pageNumber, seriesId);
        }
        prevSeriesId.current = seriesId;
    }, [getPaginatedPosts, pageNumber, seriesId]);

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
                    isLoading={isLoading}
                    isError={isError}
                    errorMessage={errorMessage}
                    postCount={postCount}
                    url={url}
                    series={seriesObj[seriesId]}
                    folderObj={folderObj}
                    paginatedPosts={paginatedPosts}/>
                <div className={styles.modalCardFooter}>
                    <Pagination
                        getPaginatedPosts={(pageNumber) => getPaginatedPosts(pageNumber, seriesId)}
                        pageNum={pageNumber}
                        maxPageNum={maxPageNumber}/>
                    <PaginationSearch
                        getPaginatedPosts={(pageNumber) => getPaginatedPosts(pageNumber, seriesId)}
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
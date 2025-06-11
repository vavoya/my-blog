import {useCallback, useState} from "react";
import styles from "@/components/modal/components/modal.module.scss";
import Pagination from "@/components/modal/components/Pagination";
import PaginationSearch from "@/components/modal/components/PaginationSearch";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {PageNumberResult} from "@/models/pagination/pageNum/type";
import {FolderObj} from "@/components/modal/utils/toObj";
import {usePaginatedPostsQuery} from "@/components/modal/_queries/usePaginatedPostsQuery";
import CardBody from "@/components/modal/managementFolderModal/CardBody";
import {PaginatedPostsResponse} from "@/models/post_info/types";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";

type CardSectionProps = {
    userId: UserInfoResponse['_id'];
    setPost: (post: PaginatedPostsResponse) => void;
    folderObj: FolderObj;
    seriesId: SeriesInfoResponse['_id'];
    folderPath: FolderInfoResponse['_id'][];
    initPageNumber: PageNumberResult['pageNumber'];
}

export default function CardSection({userId, setPost, seriesId, folderObj, folderPath, initPageNumber}: CardSectionProps) {
    const [pageNumber, setPageNumber] = useState(initPageNumber);
    const folderId = folderPath[folderPath.length - 1];
    const postCount = folderObj[folderPath[folderPath.length - 1]].post_count;
    const maxPageNumber = Math.ceil(postCount / 12);

    const { data, isFetching } = usePaginatedPostsQuery(userId, folderId, pageNumber);

    const isError =  !!data && data.status !== 200;
    const errorMessage = isError ? data.message : "";
    const paginatedPosts = !!data && data.status === 200 ? data.data : [];

    const path =  `${folderPath.map(folderId => folderObj[folderId].folder_name).join("/")}`;

    const getPaginatedPosts = useCallback((newPageNumber: PageNumberResult['pageNumber']) => {
        setPageNumber(newPageNumber);
    }, [])

    return (
        <div className={styles.modalCardSection}>
            <div className={styles.modalCardHeader}>
                <span>
                    {path}
                </span>
                <span>
                    {postCount} 개의 글 | {maxPageNumber} 페이지
                </span>
            </div>
            <CardBody
                isLoading={isFetching}
                isError={isError}
                errorMessage={errorMessage}
                postCount={postCount}
                path={path}
                seriesId={seriesId}
                setPost={setPost}
                paginatedPosts={paginatedPosts}/>
            <div className={styles.modalCardFooter}>
                <Pagination
                    getPaginatedPosts={(pageNumber) => getPaginatedPosts(pageNumber)}
                    pageNum={pageNumber}
                    maxPageNum={maxPageNumber}/>
                <PaginationSearch
                    getPaginatedPosts={(pageNumber) => getPaginatedPosts(pageNumber)}
                    maxPageNum={maxPageNumber}/>
            </div>
        </div>
    )
}
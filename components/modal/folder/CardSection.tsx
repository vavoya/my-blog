import {useCallback, useEffect, useRef, useState, useTransition} from "react";
import styles from "@/components/modal/components/modal.module.scss";
import Pagination from "@/components/modal/components/Pagination";
import PaginationSearch from "@/components/modal/components/PaginationSearch";
import CardBody from "@/components/modal/folder/CardBody";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Url} from "@/components/sideBar/types";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {PageNumberResult} from "@/models/pagination/pageNum/type";
import getByFolderId from "@/fetch/client/paginatedPost/getByFolderId";
import {PaginatedPostsResponse} from "@/models/post_info/types";
import {FolderObj} from "@/components/modal/utils/toObj";

type CardSectionProps = {
    userId: UserInfoResponse['_id'];
    url: Url;
    folderObj: FolderObj;
    folderPath: FolderInfoResponse['_id'][];
    initPageNumber: PageNumberResult['pageNumber'];
}

export default function CardSection({userId, url, folderObj, folderPath, initPageNumber}: CardSectionProps) {
    const [pageNumber, setPageNumber] = useState(initPageNumber);
    const [paginatedPosts, setPaginatedPosts] = useState<PaginatedPostsResponse[]>([]);
    const [isLoading, startTransition] = useTransition();
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const postCount = folderObj[folderPath[folderPath.length - 1]].post_count;
    const maxPageNumber = Math.ceil(postCount / 12);
    const path =  `${folderPath.map(folderId => folderObj[folderId].folder_name).join("/")}`;
    const folderId = folderPath[folderPath.length - 1];
    const prevFolderId = useRef(folderId)

    const getPaginatedPosts = useCallback((pageNumber: PageNumberResult['pageNumber'], folderId: FolderInfoResponse['_id']) => {

        setPageNumber(pageNumber);
        startTransition(async () => {
            const result = await getByFolderId(userId, folderId, pageNumber);

            if (result.status === 200) {
                setIsError(false);
                setPaginatedPosts(result.data);
            } else {
                setIsError(true);
                setErrorMessage(result.message);
            }
        })
    }, [userId]);

    useEffect(() => {
        if (folderId !== prevFolderId.current) {
            getPaginatedPosts(1, folderId);
        } else {
            getPaginatedPosts(pageNumber, folderId);
        }
        prevFolderId.current = folderId;
    }, [folderId, getPaginatedPosts, pageNumber]);

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
                isLoading={isLoading}
                isError={isError}
                errorMessage={errorMessage}
                postCount={postCount}
                url={url}
                path={path}
                paginatedPosts={paginatedPosts}/>
            <div className={styles.modalCardFooter}>
                <Pagination
                    getPaginatedPosts={(pageNumber) => getPaginatedPosts(pageNumber, folderId)}
                    pageNum={pageNumber}
                    maxPageNum={maxPageNumber}/>
                <PaginationSearch
                    getPaginatedPosts={(pageNumber) => getPaginatedPosts(pageNumber, folderId)}
                    maxPageNum={maxPageNumber}/>
            </div>
        </div>
    )
}
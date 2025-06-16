import styles from "@/components/modal/components/modal.module.scss";
import {PaginatedPostsResponse} from "@/data-access/post-info/types";
import CardItem from "@/components/modal/management-folder-modal/CardItem";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";

type CardBodyProps = {
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    postCount: number;
    seriesId: SeriesInfoResponse['_id'];
    paginatedPosts: PaginatedPostsResponse[];
    setPost: (post: PaginatedPostsResponse) => void;
    path: string;
}

const LOADING_MESSAGE = "불러오는 중...";
const NO_POSTS_MESSAGE = "해당 폴더에 포스트가 없어요";
export default function CardBody({isLoading, isError, errorMessage, postCount, seriesId, paginatedPosts, setPost, path}: CardBodyProps) {
    const noPosts = postCount === 0;

    return (
        <div className={styles.modalCardBody}>
            {
                isLoading
                    ? (<span>{LOADING_MESSAGE}</span>)
                    : isError
                        ? (<span>{errorMessage}</span>)
                        : noPosts
                            ? (<span>{NO_POSTS_MESSAGE}</span>)
                            :paginatedPosts.map((paginatedPost) => {

                                return (
                                    <CardItem
                                        key={paginatedPost._id}
                                        paginatedPost={paginatedPost}
                                        seriesId={seriesId}
                                        setPost={setPost}
                                        path={path}/>
                                )
                            })
            }
        </div>
    )
}
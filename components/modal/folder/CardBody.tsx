import styles from "@/components/modal/components/modal.module.scss";
import {Url} from "@/components/sideBar/types";
import {PaginatedPostsResponse} from "@/data-access/post-info/types";
import CardItem from "@/components/modal/components/CardItem";

type CardBodyProps = {
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    postCount: number;
    url: Url;
    paginatedPosts: PaginatedPostsResponse[];
    path: string;
}

const LOADING_MESSAGE = "불러오는 중...";
const NO_POSTS_MESSAGE = "해당 폴더에 포스트가 없어요";
export default function CardBody({isLoading, isError, errorMessage, postCount, url, paginatedPosts, path}: CardBodyProps) {
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
                                const {
                                    post_url: postUrl,
                                    post_description: description,
                                    post_name: name,
                                    post_createdAt: createdAt,
                                    thumb_url: thumbUrl
                                } = paginatedPost;
                                const href = `/${url.blog}/${postUrl}`;

                                return (
                                    <CardItem
                                        key={href}
                                        url={url}
                                        href={href}
                                        thumbUrl={thumbUrl}
                                        name={name}
                                        description={description}
                                        createdAt={createdAt}
                                        path={path}/>
                                )
                            })
            }
        </div>
    )
}
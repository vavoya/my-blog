import styles from "@/components/modal/components/modal.module.scss";
import {Url} from "@/components/sideBar/types";
import {PaginatedPostsResponse} from "@/models/post_info/types";
import CardItem from "@/components/modal/components/CardItem";
import {FolderObj} from "@/components/modal/utils/toObj";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import {buildFolderPathIds} from "@/utils/buildFolderPathIds";


type CardBodyProps = {
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    postCount: number;
    url: Url;
    series: SeriesInfoResponse;
    paginatedPosts: PaginatedPostsResponse[];
    folderObj: FolderObj;
}

const LOADING_MESSAGE = "불러오는 중...";
const NO_POSTS_MESSAGE = "해당 시리즈에 포스트가 없어요";
export default function CardBody({isLoading, isError, errorMessage, postCount, url, series, paginatedPosts, folderObj}: CardBodyProps) {
    const noPosts = postCount === 0;

    const postObj = series.post_list.reduce((acc: {[id: PostInfoResponse['_id']]: number}, cur, curI) => {
        acc[cur] = curI + 1;
        return acc;
    }, {})

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
                                const folderPath = buildFolderPathIds(paginatedPost.folder_id, folderObj)
                                const path =  `${folderPath.map(folderId => folderObj[folderId].folder_name).join("/")}`;

                                const order = postObj[paginatedPost['_id']];

                                return (
                                    <CardItem
                                        key={href}
                                        url={url}
                                        href={href}
                                        thumbUrl={thumbUrl}
                                        name={name}
                                        description={description}
                                        createdAt={createdAt}
                                        path={path}
                                        seriesOrder={order}/>
                                )
                            })
            }
        </div>
    )
}
import styles from "@/components/modal/components/modal.module.scss";
import styles2 from "@/components/modal/components/CardItem.module.css";
import Image from "next/image";
import MoveBackgroundAnimation from "@/components/modal/components/MoveBackgroundAnimation";
import {useEffect, useRef, useState} from "react";
import {formatDate} from "@/utils/formatDate";
import {PaginatedPostsResponse} from "@/models/post_info/types";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";

type CardItemProps = {
    paginatedPost: PaginatedPostsResponse;
    seriesId: SeriesInfoResponse['_id'];
    setPost: (post: PaginatedPostsResponse) => void;
    path: string;
}

export default function CardItem({paginatedPost, seriesId, setPost, path}: CardItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const disabled = (!!paginatedPost.series_id && paginatedPost.series_id !== seriesId)

    useEffect(() => {
        setIsMounted(true)
    }, []);


    return (
        <div ref={ref}
                className={styles.modalCardItem}
                onClick={() => {
                    if (!disabled) {
                        setPost(paginatedPost);
                    }
                }}>
            {
                paginatedPost.thumb_url && (
                    <Image
                        src={paginatedPost.thumb_url}
                        width={300}
                        height={200}
                        objectFit={"cover"}
                        alt={"thumbnail"}/>
                )

            }
            {
                disabled
                    ? <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(var(--primary-color), 0.1)'
                    }} />
                    :  isMounted && <MoveBackgroundAnimation width={ref.current!.offsetWidth} height={ref.current!.offsetHeight}/>
            }
            <div className={styles2.metadata}>
                <span>
                    {path}
                </span>
                <time>
                    {formatDate(new Date(paginatedPost.post_createdAt))}
                </time>
            </div>
            <div className={styles2.title}>
                <span>
                    {paginatedPost.post_name}
                </span>
            </div>
            <div className={styles2.description}>
                <span>
                    {paginatedPost.post_description}
                </span>
            </div>
        </div>

    )
}
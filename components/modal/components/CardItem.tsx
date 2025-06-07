import Link from "next/link";
import styles from "@/components/modal/components/modal.module.scss";
import styles2 from "@/components/modal/components/CardItem.module.css";
import Image from "next/image";
import MoveBackgroundAnimation from "@/components/modal/components/MoveBackgroundAnimation";
import {useEffect, useRef, useState} from "react";
import SeriesOrderBox from "@/components/modal/series/SeriesOrderBox";
import {Url} from "@/components/sideBar/types";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";
import {formatDate} from "@/utils/formatDate";
import ProcessingOverlayLink from "@/components/ProcessingOverlayLink";

type CardItemProps = {
    url: Url;
    href: string;
    thumbUrl: PostInfoResponse["thumb_url"];
    name: PostInfoResponse['post_name'];
    description: PostInfoResponse["post_description"];
    createdAt: PostInfoResponse['post_createdAt'];
    path: string;
    seriesOrder?: number;
}

export default function CardItem({url, href, thumbUrl, name, description, createdAt, path, seriesOrder = 0}: CardItemProps) {
    const ref = useRef<HTMLAnchorElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, []);

    const currentHref = decodeURIComponent(`/${url.blog}/${url.post}`)

    return (
        <ProcessingOverlayLink
            ref={ref}
            className={styles.modalCardItem}
            onClick={(e) => {
                // 동일 페이지 방문 방지
                if (currentHref === href) e.preventDefault();
            }}
            href={href}>
            {
                seriesOrder === 0
                    ? null
                    : <SeriesOrderBox sereisOrder={seriesOrder} />
            }
            {
                thumbUrl && (
                    <Image
                        src={thumbUrl}
                        width={300}
                        height={200}
                        objectFit={"cover"}
                        alt={"thumbnail"}/>
                )

            }
            {
                currentHref === href
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
                    {formatDate(new Date(createdAt))}
                </time>
            </div>
            <div className={styles2.title}>
                <span>
                    {name}
                </span>
            </div>
            <div className={styles2.description}>
                <span>
                    {description}
                </span>
            </div>
        </ProcessingOverlayLink>

    )
}
import {RefObject} from "react";
import styles from "./postListFooter.module.css"

type PostListFooterProps = {
    hasPage: boolean;
    isError: boolean;
    hasNext: boolean;
    errorMessage: string | undefined;
    intersectionTarget: RefObject<HTMLDivElement | null>;
}
export default function PostListFooter({hasPage, isError, hasNext, errorMessage, intersectionTarget}: PostListFooterProps) {

    return (
        isError ? (
            <div className={styles.error}><span>{errorMessage}</span></div>
        ) : (
            hasNext ? (
                <div ref={intersectionTarget} className={styles.loading}><span>다음 포스트 불러오는 중...</span></div>
            ) : (
                !hasPage &&<div className={styles.error}><span>포스트가 없습니다.</span></div>
            )
        )
    )
}

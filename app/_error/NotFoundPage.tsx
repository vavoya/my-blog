import styles from "./NotFoundPage.module.css"
import Link from "next/link";

export default function NotFoundPage({url = '/'}: {url?: string}) {


    return (
        <div className={styles.container}>
            <span className={styles.errorTitle}>404!</span>
            <span className={styles.errorText}>페이지 없음</span>
            <Link href={url} className={styles.link}>
                홈으로 이동
            </Link>
        </div>
    )
}
import styles from "./NotFoundPage.module.css"
import ProcessingOverlayLink from "@/components/ProcessingOverlayLink";

export default function ServerErrorPage({url = '/'}: {url?: string}) {


    return (
        <div className={styles.container}>
            <span className={styles.errorTitle}>500!</span>
            <span className={styles.errorText}>서버 오류</span>
            <ProcessingOverlayLink href={url} className={styles.link}>
                홈으로 이동
            </ProcessingOverlayLink>
        </div>
    )
}
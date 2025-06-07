import styles from "./NotFoundPage.module.css"
import ProcessingOverlayLink from "@/components/ProcessingOverlayLink";

export default function BadRequestPage({url = '/'}: {url?: string}) {


    return (
        <div className={styles.container}>
            <span className={styles.errorTitle}>400!</span>
            <span className={styles.errorText}>잘못된 요청</span>
            <ProcessingOverlayLink href={url} className={styles.link}>
                홈으로 이동
            </ProcessingOverlayLink>
        </div>
    )
}
import styles from "@/app/management/_window/post/components/postContent.module.scss";
import { MarkdownRenderer } from "@/components/react-markdown/MarkdownRenderer";



type PreviewWindowProps = {
    markdown: string;
}
export default function PreviewWindow({ markdown }: PreviewWindowProps) {

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <div className={styles.content}>
                    <MarkdownRenderer markdown={markdown} />
                </div>
            </div>
        </div>
    )
}
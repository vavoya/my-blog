import Link from "next/link";
import styles from "@/app/_error/NotFoundPage.module.css";

type SearchParams = {
    [key: string]: string | string[] | undefined;
}

export default async function Page({searchParams}: {searchParams: Promise<SearchParams>}) {
    const params = await searchParams;
    const href = Array.isArray(params.homeUrl) ? params.homeUrl[0] : params.homeUrl ?? '/';
    const name = Array.isArray(params.name) ? params.name[0] : params.name ?? '';

    return (
        <div className={styles.container}>
            <span className={styles.errorTitle}>환영합니다!</span>
            <span className={styles.errorText}>{name + ' 님'}</span>
            <Link href={`/${href}`} className={styles.link}>
                블로그 이동
            </Link>
        </div>
    )
}
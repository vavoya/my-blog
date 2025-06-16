import styles from "./page.module.css"
import Svgsimlog from "@/components/svg/Simlog";
import {signIn} from "@/auth"
import ProcessingOverlayLink from "@/components/ProcessingOverlayLink";
import Image from "next/image";


type SearchParams = {
    [key: string]: string | string[] | undefined;
}

export default async function Page({searchParams}: {searchParams: Promise<SearchParams>}) {
    const { redirectTo } = await searchParams
    const encodedRedirectTo = typeof redirectTo === 'string' ? encodeURIComponent(redirectTo) : ''

    const signInNaver = async () => {
        'use server'
        await signIn("naver", { redirectTo: `/register${encodedRedirectTo ? `?redirectTo=${encodedRedirectTo}` : ""}` })
    }

    return (
        <main style={{
            maxWidth: '400px',
            width: '100%',
            minHeight: '100dvh',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div className={styles.container}>
                <ProcessingOverlayLink href={'/'} className={styles.logo}>
                    <Svgsimlog />
                </ProcessingOverlayLink>
                <span className={styles.title}>
                    로그인
                </span>
                <div className={styles.oauthButtonSection}>
                    <form
                        action={signInNaver}>
                        <button>
                            <Image width={70} height={70} src={"/png/naverLogin.png"} alt={"네이버 로그인"} />
                            <span>
                                네이버
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </main>
)
}







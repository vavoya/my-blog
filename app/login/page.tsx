import styles from "./page.module.css"
import SvgSLoG from "@/components/svg/S-Log";
import Link from "next/link";
import SvgApple from "@/components/svg/Apple";
import SvgGoogle from "@/components/svg/Google";
import {signIn} from "@/auth"


type SearchParams = {
    [key: string]: string | string[] | undefined;
}

export default async function Page({searchParams}: {searchParams: SearchParams}) {
    const {redirectTo} = await searchParams

    const signInGoogle = async () => {
        'use server'
        await signIn("google", { redirectTo: `/register${redirectTo ? `?redirectTo=${redirectTo}` : ""}` })
    }

    return (
        <main style={{
            maxWidth: '400px',
            width: '100%',
            minHeight: '100vh',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div className={styles.container}>
                <Link href={'/'} className={styles.logo}>
                    <SvgSLoG />
                </Link>
                <span className={styles.title}>
                    로그인
                </span>
                <div className={styles.oauthButtonSection}>
                    <form
                        action={signInGoogle}>
                        <button>
                            <SvgGoogle/>
                            <span>
                                Google
                            </span>
                        </button>
                    </form>
                    <form>
                        <button>
                            <SvgApple/>
                            <span>
                                Apple
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </main>
)
}







import SvgSLoGHeader from "@/components/svg/SL";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {ReactNode} from "react";
import styles from "./header.module.scss"
import {auth, signOut} from "@/auth";
import LogInButton from "@/app/[blog]/_component/LogInButton";
import ProcessingOverlayLink from "@/components/ProcessingOverlayLink";

type HeaderProps = {
    blog?: UserInfoResponse['blog_url'];
    blogName?: UserInfoResponse['blog_name'];
    children?: ReactNode;
}
export default async function Header({blog, blogName, children}: HeaderProps) {
    const blogUrl = `/${blog}`;
    const session = await auth()


    return (
        <header className={styles.container}>
            <div className={styles.header}>
                <div className={styles.logo}>
                    <ProcessingOverlayLink tabIndex={0} href={'/'}>
                        <SvgSLoGHeader/>
                    </ProcessingOverlayLink>
                </div>
                {
                    blog &&
                    <div className={styles.blogHome}>
                        <ProcessingOverlayLink tabIndex={0} href={blogUrl}>
                            <span>{blogName}</span>
                        </ProcessingOverlayLink>
                    </div>
                }
                <div className={styles.option}>
                    {
                        session?.registrationState == true ?
                            <form
                                action={async () => {
                                    "use server"
                                    await signOut()
                                }}
                            >
                                <button tabIndex={0} type={'submit'}>
                                    로그 아웃
                                </button>
                            </form> :
                            <LogInButton />
                    }
                </div>
            </div>
            {children}
        </header>
    )
}
import styles from "@/app/[blog]/[post]/page.module.css";
import Image from "next/image";
import React, {ReactNode} from "react";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";
import {formatDate} from "@/utils/formatDate";
import {AstRenderer} from "@/components/react-markdown/MarkdownRenderer";
import {RootBlockNode} from "md-ast-parser";


export const renderPost = (postInfo: PostInfoResponse): ReactNode => (
    <article className={styles.article}>
        <header className={styles.header}>
            {
                /*
                <ul className={styles.taglist}>
                {posts.tag.map((tag, index) => (<li key={index}>{tag}</li>)) }
            </ul>
                 */
            }
            <h1>{postInfo.post_name}</h1>
            <span className={styles.date}>{`${formatDate(new Date(postInfo.post_createdAt))}`}</span>
            {
                postInfo.thumb_url && (
                    <figure style={{
                        width: "100%",
                        aspectRatio: "3 / 2",
                        position: "relative"
                    }}>
                        <Image
                            src={postInfo.thumb_url}
                            alt="대표 이미지"
                            className={styles.vercelLogo}
                            fill
                            objectFit={"cover"}
                            priority
                        />
                    </figure>
                )
            }
        </header>
        <section>
                <AstRenderer ast={postInfo.post_ast as RootBlockNode} />
        </section>
    </article>
);



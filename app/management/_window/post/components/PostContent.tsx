import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";
import {POST_CONTENT_LIMIT, POST_NAME_LIMIT} from "@/const/post";
import styles from "./postContent.module.scss"
import Button from "@/app/management/_window/post/components/Button";
import {useEffect, useState} from "react";
import {OnDanger, OnNextStep} from "@/app/management/_window/post/PostWindow";


type PostContentProps = {
    postName: PostInfoResponse['post_name'],
    postContent: PostInfoResponse['post_content'],
    onNextStep: OnNextStep;
    onDanger?: OnDanger;
}
export default function PostContent({postName, postContent, onNextStep, onDanger}: PostContentProps) {
    const [name, setName] = useState(postName);
    const [content, setContent] = useState(postContent);

    // 띄운 미리보기 윈도우 삭제
    useEffect(() => {

    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <label className={'sr-only'} htmlFor="post_name">포스트 제목</label>
                <input id="post_name"
                       className={styles.name}
                       maxLength={POST_NAME_LIMIT}
                       type="text"
                       placeholder={"제목을 입력하세요."}
                       defaultValue={name}
                       onChange={e => {
                           setName(e.target.value);
                       }} />
                <label className={'sr-only'} htmlFor="post-content">포스트 본문</label>
                <textarea id="post-content"
                          className={styles.content}
                          defaultValue={content}
                          placeholder={"내용을 입력하세요."}
                          maxLength={POST_CONTENT_LIMIT}
                          onChange={e => {
                              setContent(e.target.value);
                          }}/>
            </div>
            <Button primary={{text: "다음", onClick: () => onNextStep(name, content)}} secondary={{text: "미리보기"}} danger={onDanger ? {text: "삭제", onClick: onDanger} : undefined}/>
        </div>
    )
}
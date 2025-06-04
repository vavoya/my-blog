import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";
import {POST_CONTENT_LIMIT, POST_NAME_LIMIT} from "@/const/post";
import styles from "./postContent.module.scss"
import Button from "@/app/management/_window/post/components/Button";
import {useEffect, useRef, useState} from "react";
import {OnDanger, OnNextStep} from "@/app/management/_window/post/PostWindow";
import {useManagementStore} from "@/store/ManagementProvider";
import {WindowCommandBuilder} from "@/app/management/_window/provider/utils/windowCommands";
import createWindowObj from "@/app/management/_window/provider/utils/createWindowObj";
import PreviewWindow from "@/app/management/_window/preview/PreviewWindow";


type PostContentProps = {
    postName: PostInfoResponse['post_name'],
    postContent: PostInfoResponse['post_content'],
    onNextStep: OnNextStep;
    onDanger?: OnDanger;
}
export default function PostContent({postName, postContent, onNextStep, onDanger}: PostContentProps) {
    const [name, setName] = useState(postName);
    const [content, setContent] = useState(postContent);
    const setWindows = useManagementStore((state) => state.setWindows);
    const previewWindowOpen = useRef(false) // 미리보기 윈도우 열림 여부

    // 입력에 따른 미리보기 업데이트
    useEffect(() => {
        // 미리보기 윈도우가 열려있으면 미리보기 윈도우를 업데이트/
        if (previewWindowOpen.current) {
            const commands = new WindowCommandBuilder().update([
                createWindowObj("PreviewWindow-new", "새 포스트 미리보기", <PreviewWindow markdown={content}/>, 0, 0, 600, 400)
            ]).returnCommand()
            setWindows(commands);
        }

        return () => {
            // 포스트 윈도우가 닫히면, 미리보기 윈도우를 닫아준다.
            if (previewWindowOpen.current) {
                const commands = new WindowCommandBuilder().remove(["PreviewWindow-new"]).returnCommand()
                setWindows(commands);
            }
        }
    }, [content, setWindows]);

    const onPreview = () => {
        const commands = new WindowCommandBuilder().add([
            createWindowObj("PreviewWindow-new", "새 포스트 미리보기", <PreviewWindow markdown={content}/>, 0, 0, 600, 400)
        ]).returnCommand()

        previewWindowOpen.current = true;
        setWindows(commands);
    }

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
            <Button primary={{text: "다음", onClick: () => onNextStep(name, content)}} secondary={{text: "미리보기", onClick: onPreview}} danger={onDanger ? {text: "삭제", onClick: onDanger} : undefined}/>
        </div>
    )
}
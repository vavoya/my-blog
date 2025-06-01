import useAsyncTaskManager from "@/hook/useAsyncTaskManager";
import { useManagementStore } from "@/store/ManagementProvider";
import {useAboutQuery} from "@/app/management/_queries/useAboutQuery";
import {useEffect, useState} from "react";
import {AboutInfoResponse} from "@/lib/mongoDB/types/documents/aboutInfo.type";
import LoadingPost from "@/app/management/_window/post/components/LoadingPost";
import styles from "@/app/management/_window/post/components/postContent.module.scss";
import {POST_CONTENT_LIMIT} from "@/const/post";
import Button from "@/app/management/_window/post/components/Button";
import {createUpdateAboutAsyncTask} from "@/app/management/_window/about/handler/createUpdateAboutAsyncTask";

type AboutState = {
    status: "fetching";
    data: undefined;
} | {
    status: "error";
    message: string;
} | {
    status: "success";
    data: AboutInfoResponse;
}
export default function AboutWindow() {
    const asyncTaskManager = useAsyncTaskManager();
    const userInfo = useManagementStore((state) => state.userInfo);
    const { data } = useAboutQuery(userInfo._id);
    const [aboutState, setAboutState] = useState<AboutState>({
        status: "fetching",
        data: undefined,
    });

    useEffect(() => {
        if (data) {
            if (data.status === 200) {
                setAboutState({
                    status: "success",
                    data: data.data,
                })
            } else {
                setAboutState({
                    status: "error",
                    message: data.message
                })
            }
        } else {
            setAboutState({
                status: "fetching",
                data: undefined,
            })
        }
    }, [data]);

    // 리액트 쿼리의 콜백함수 내에서 에러를 전부 처리하기 때문에, fetching 이후는 undefined 가 나오지 않는다.
    if (aboutState.status === "fetching") return <LoadingPost />;
    if (aboutState.status === 'error') return <div><span>{aboutState.message}</span></div>;


    const fetchAbout = () => {
        const ValidationResult = aboutState.data.content !== "";
        if (!ValidationResult) {
            return false;
        }

        asyncTaskManager.addAsyncTask(createUpdateAboutAsyncTask(
            {
                userId: userInfo._id,
                content: aboutState.data.content,
                lastModified: userInfo.last_modified
            }
        ))
    }

    return (
        <div className={styles.container}>
            <div className={styles.box}>

                <label className={'sr-only'} htmlFor="post-content">포스트 본문</label>
                <textarea id="post-content"
                          className={styles.content}
                          defaultValue={aboutState.data.content}
                          placeholder={"내용을 입력하세요."}
                          maxLength={POST_CONTENT_LIMIT}
                          onChange={e => {
                              setAboutState({
                                  ...aboutState,
                                  data: {
                                      ...aboutState.data,
                                      content: e.target.value
                                  }
                              });
                          }}/>
            </div>
            <Button primary={{text: "저장", onClick: () => fetchAbout()}} secondary={{text: "미리보기"}} />
        </div>
    )
}
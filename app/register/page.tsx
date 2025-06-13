'use client'

import {useRouter} from "next/navigation";
import {MouseEventHandler, useEffect, useState} from "react";
import Input from "@/app/register/_components/Input";
import {validateRegister} from "@/validation/client/regist/validateRegist";
import registBySession from "@/fetch/client/regist/registBySession";
import ProcessingOverlay from "@/components/processingOverlay/ProcessingOverlay";
import styles from "./page.module.scss"
import {BLOG_NAME_LIMIT, BLOG_URL_LIMIT, USER_NAME_LIMIT} from "@/const/user";
import {useSession} from "next-auth/react";

export type State = {
    name?: string
    blogName?: string
    blogSlug?: string
}



export default function Page() {
    const router = useRouter()
    const session = useSession()
    const [state, setState] = useState<Required<State>>({
        name: "",
        blogName: "",
        blogSlug: "",
    })
    const [errorText, setErrorText] = useState<State>({
        name: "",
        blogName: "",
        blogSlug: "",
    })
    // state: 0(요청 x), 1(요청 중), 2(요청 끝남, 확인 필요)
    type SubmitState =
        | { state: "idle" }                          // 요청 전
        | { state: "submitting"; text: string }                   // 요청 중
        | { state: "submitted"; text: string }      // 요청 완료, 확인 필요

    const [isSubmitting, setIsSubmitting] = useState<SubmitState>({
        state: "idle",
    })

    useEffect(() => {
        const html = document.documentElement; // document.html 대신 document.documentElement 사용
        if (isSubmitting.state === "idle") {
            // html 페이지 스크롤 막기
            html.style.overflow = '';
        } else {
            html.style.overflow = 'hidden';
        }
    }, [isSubmitting]);

    const onSubmit: MouseEventHandler = async () => {
        // 검증
        const validationResult =  validateRegister(state.name, state.blogName, state.blogSlug);
        // 에러 처리
        if (!validationResult.isValid) {
            switch (validationResult.type) {
                case "name":
                    setErrorText({
                        name: "이름을 입력해 주세요."
                    })
                    return;
                case "blogName":
                    setErrorText({
                        blogName: "블로그 이름을 입력해 주세요."
                    })
                    return;
                case "blogUrl":
                    setErrorText({
                        blogSlug: "블로그 주소를 입력해 주세요."
                    })
                    return;
                case "blogUrlSyntax":
                    setErrorText({
                        blogSlug: "영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.\n" +
                            "하이픈은 처음이나 끝에 올 수 없고, 연속으로 사용할 수 없습니다"
                    })
                    return;
            }
        }
        // fetch
        setIsSubmitting({
            state: "submitting",
            text: "사용자 등록 중..."
        })

        const result = await registBySession({
            name: state.name,
            blogName: state.blogName,
            blogUrl: state.blogSlug
        })
        if (result.status === 200) {
            await session.update()
            router.push(`/register/success?homeUrl=@${state.blogSlug}&name=${state.name}`);
        } else if (result.status === 400) {
            setIsSubmitting({
                state: "submitted",
                text: "이미 등록된 사용자 이름입니다."
            })
        } else if (result.status === 409) {
            setIsSubmitting({
                state: "submitted",
                text: "이미 등록된 블로그 주소입니다."
            })
        } else if (result.status === 500) {
            setIsSubmitting({
                state: "submitted",
                text: "서버에 문제가 발생했습니다."
            })
        } else {
            setIsSubmitting({
                state: "submitted",
                text: result.message ?? "서버에 문제가 발생했습니다."
            })
        }
    }


    return (
        <main className={styles.registerPage}>
            <h1>
                사용자 등록
            </h1>
            <Input id={"userName"}
                   title={"* 사용자 이름"}
                   placeholder={"사용자 이름을 입력해 주세요"}
                   onChange={(event) => setState({
                       ...state,
                       name: event.target.value
                   })}
                   maxLength={USER_NAME_LIMIT}
                   errorText={errorText.name} />
            <Input id={"blogName"}
                   title={"* 블로그 이름"}
                   placeholder={"블로그 이름을 입력해 주세요"}
                   onChange={(event) => setState({
                       ...state,
                       blogName: event.target.value
                   })}
                   maxLength={BLOG_NAME_LIMIT}
                   errorText={errorText.blogName} />
            <Input id={"blogSlug"}
                   title={"* 블로그 주소"}
                   placeholder={"블로그 주소를 입력해 주세요"}
                   onChange={(event) => setState({
                       ...state,
                       blogSlug: event.target.value
                   })}
                   beforeText={"/@"}
                   maxLength={BLOG_URL_LIMIT}
                   errorText={errorText.blogSlug} />
            {
                /*
                <label>
                <input
                    type="checkbox"
                    checked={true}
                    required
                />
                <a href="/terms" target="_blank">이용약관 자세히 보기</a> 및
                <a href="/privacy" target="_blank">개인정보처리방침 자세히 보기</a>에 동의합니다.
            </label>
                 */
            }


            <button onClick={onSubmit}>
                {isSubmitting.state === "idle" ? "등록" : "처리 중..."}
            </button>
            {
                isSubmitting.state !== "idle" &&
                <ProcessingOverlay
                    text={isSubmitting.text}
                    onClick={isSubmitting.state === "submitted" ? () => {setIsSubmitting({
                        state: "idle",
                    })} : () => null}/>
            }
        </main>
    )
}
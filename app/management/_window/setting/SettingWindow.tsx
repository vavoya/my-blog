import useAsyncTaskManager from "@/hook/useAsyncTaskManager";
import {useManagementStore} from "@/store/ManagementProvider";
import React, {MouseEventHandler, ReactNode, useCallback, useRef, useState} from "react";
import InputBox from "@/app/management/_components/input-box/InputBox";
import styles from "./settingWindow.module.scss"
import {BLOG_NAME_LIMIT, USER_NAME_LIMIT} from "@/const/user";
import SvgCheck from "@/components/svg/Check";
import {createPortal} from "react-dom";
import ConfirmModal from "@/app/management/_window/folder/components/ConfirmModal";
import {createRemoveAccountAsyncTask} from "@/app/management/_window/setting/handlers/createRemoveAccountAsyncTask";
import {signOut} from "next-auth/react";
import useRootMouseDownOutside from "@/hook/useRootMouseDownOutside";
import {createUpdateUserAsyncTask} from "@/app/management/_window/setting/handlers/createUpdateUserAsyncTask";


export default function SettingWindow() {
    const asyncTaskManager = useAsyncTaskManager();
    const userInfo = useManagementStore((state) => state.userInfo);
    const setUserInfo = useManagementStore((state) => state.setUserInfo);


    const [ userName, setUserName ] = useState(userInfo.user_name);
    const [ blogName, setBlogName ] = useState(userInfo.blog_name);
    const [ isEmailAgree, setEmailAgree ] = useState(userInfo.agreements.email);

    // 회원 탈퇴 관련 로직
    const [ removeAccountModal, setRemoveAccountModal ] = useState<ReactNode | null>(null);
    const modalRef = useRef<HTMLDivElement>(null)
    useRootMouseDownOutside(modalRef, () => setRemoveAccountModal(null))
    const openAccountRemoveModal = useCallback(() => {
        const removeAccountAsync: MouseEventHandler = () => {
            asyncTaskManager.addAsyncTask(createRemoveAccountAsyncTask({
                sessionUpdate: async () => {
                    await signOut({redirectTo: '/'});
                    return null;
                }})
            )
        }

        // 모달
        setRemoveAccountModal(
            createPortal(
                <ConfirmModal
                    ref={modalRef}
                    modalTitle={`계정 탈퇴`}
                    modalText={[
                        '계정 탈퇴 시 해당 계정으로는 더 이상 서비스를 이용할 수 없습니다.',
                        '이 작업은 되돌릴 수 없습니다.'
                    ]}
                    secondary={{
                        text: '취소',
                        onClick: () => setRemoveAccountModal(null)
                    }}
                    primary={{
                        text: '탈퇴',
                        onClick: removeAccountAsync
                    }} />, document.body
            )
        )
    }, [asyncTaskManager])

    // 유저 정보 수정 로직
    const updateUserAsync: MouseEventHandler = () => {
        asyncTaskManager.addAsyncTask(createUpdateUserAsyncTask({
            userInfo: userInfo,
            userId: userInfo._id,
            userName: userName,
            blogName: blogName,
            agreementsEmail: isEmailAgree,
            lastModified: userInfo.last_modified
            }, {
            setUserInfo,
            })
        )
    }

    return (
        <div className={styles.window}>
            <div className={styles.settingSection}>
                <InputBox title={'사용자 이름'}
                          placeholder={"사용자 이름을 입력하세요"}
                          defaultValue={userName}
                          onChange={(value) => setUserName(value)}
                          maxLength={USER_NAME_LIMIT}/>
                <InputBox title={'블로그 이름'}
                          placeholder={"블로그 이름을 입력하세요"}
                          defaultValue={blogName}
                          onChange={(value) => setBlogName(value)}
                          maxLength={BLOG_NAME_LIMIT}/>
                <InputBox title={'이메일 수신 여부'}>
                    <input id={'이메일 수신 여부'}
                           className={'sr-only'}
                           type="checkbox"
                           name="email_agreement"
                           checked={isEmailAgree}
                           onChange={() => setEmailAgree(!isEmailAgree)}/>
                    <div className={styles.checkBox}
                         onClick={() => setEmailAgree(!isEmailAgree)}>
                        {
                            isEmailAgree && <SvgCheck />
                        }
                    </div>
                </InputBox>
                <InputBox title={'회원 탈퇴'}>
                    <button className={styles.accountRemoveButton}
                            onClick={openAccountRemoveModal}>
                        <span>
                            탈퇴하기
                        </span>
                    </button>
                </InputBox>
            </div>
            <div className={styles.saveButtonWrapper}>
                <button disabled={!userName || !blogName} className={styles.saveButton} onClick={updateUserAsync}>
                    <span>
                        저장
                    </span>
                </button>
            </div>
            {
                removeAccountModal && createPortal(removeAccountModal, document.body)
            }
        </div>
    )
}
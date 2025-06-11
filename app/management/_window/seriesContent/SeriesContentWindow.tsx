import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import {useManagementStore} from "@/store/ManagementProvider";
import {buildFolderPath} from "@/utils/buildFolderPath";
import {usePaginatedPostIdsQuery} from "@/hook/usePaginatedPostIdsQuery";
import styles from "./seriesContentWindow.module.scss";
import {SERIES_DESCRIPTION_LIMIT, SERIES_NAME_LIMIT, SERIES_POST_LIMIT} from "@/const/series";
import React, {MouseEventHandler, ReactNode, useCallback, useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import Modal from "@/components/modal/managementFolderModal/Modal";
import {PaginatedPostsResponse} from "@/models/post_info/types";
import {formatDate} from "@/utils/formatDate";
import useRootMouseDownOutside from "@/hook/useRootMouseDownOutside";
import ConfirmModal from "@/app/management/_window/folder/components/ConfirmModal";
import useAsyncTaskManager from "@/hook/useAsyncTaskManager";
import {createDeleteSeriesAsyncTask} from "@/app/management/_window/seriesContent/handlers/createDeleteSeriesAsyncTask";
import {createUpdateSeriesAsyncTask} from "@/app/management/_window/seriesContent/handlers/createUpdateSeriesAsyncTask";
import {useQueryClient} from "@tanstack/react-query";
import {WindowCommandBuilder} from "@/app/management/_window/provider/utils/windowCommands";
import {WindowObj} from "@/app/management/_window/provider/types";
import {FolderObj, SeriesObj} from "@/components/modal/utils/toObj";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";


type SeriesContentWindowProps = {
    seriesId: SeriesInfoResponse['_id'];
    windowId: WindowObj['id'];
}
export default function SeriesContentWindow({seriesId, windowId}: SeriesContentWindowProps) {
    const seriesObj = useManagementStore((state) => state.seriesObj);
    const folderObj = useManagementStore((state) => state.folderObj);
    const userInfo = useManagementStore((state) => state.userInfo);
    const setWindows = useManagementStore((state) => state.setWindows);
    const series = seriesObj[seriesId];

    // 윈도우 닫기
    useEffect(() => {
        if (!series) {
            const commands = (new WindowCommandBuilder()).remove([windowId]).returnCommand()
            setWindows(commands)
        }
    }, [series, setWindows, windowId]);

    // 윈도우 이름 변경
    useEffect(() => {
        if (series) {
            const commands = (new WindowCommandBuilder()).rename({[windowId]: series.series_name}).returnCommand()
            setWindows(commands)
        }
    }, [folderObj, series, setWindows, windowId]);

    // 시리즈 상태 업데이트 후 폴더가 있는 경우에만 렌더링 시작
    if (series) {
        return <SeriesContentSection folderObj={folderObj} seriesObj={seriesObj} userInfo={userInfo} seriesId={seriesId}/>
    } else {
        return null
    }
}

type SeriesContentSectionProps = {
    seriesId: SeriesInfoResponse['_id'];
    userInfo: UserInfoResponse;
    seriesObj: SeriesObj;
    folderObj: FolderObj;
}
function SeriesContentSection({folderObj, seriesId, seriesObj, userInfo}: SeriesContentSectionProps) {
    const queryClient = useQueryClient();
    const asyncTaskManager = useAsyncTaskManager();
    const setSeriesObj = useManagementStore((state) => state.setSeriesObj);
    const series = seriesObj[seriesId];
    const [ seriesName, setSeriesName ] = useState(series.series_name);
    const [ seriesDescription, setSeriesDescription ] = useState(series.series_description);
    const [ postIds, setPostIds] = useState(series.post_list);
    const { isFetching, data, isError, errorMessage } = usePaginatedPostIdsQuery(userInfo._id, postIds);

    const [ openPostSelector, setOpenPostSelector ] = useState(false);
    const setPost = (post: PaginatedPostsResponse) => {
        setPostIds(prev => {
            if (prev.includes(post._id)) return prev;
            else return [ post._id, ...prev ];
        });
        setOpenPostSelector(false);
    }

    // 삭제 모달
    const [subWindow, setSubWindow] = useState<ReactNode>();
    const modalRef = useRef<HTMLDivElement>(null)
    useRootMouseDownOutside(modalRef, () => setSubWindow(null))

    const cancel: MouseEventHandler = () => {
        setSubWindow(null);
    }

    const deletePost = (post: PaginatedPostsResponse) => {
        const deleteFolder: MouseEventHandler = () => {
            setPostIds(prev => prev.filter(id => id !== post._id));
            setSubWindow(null);
            // 여기는 윈도우 삭제, 삭제가 서버까지 성공하면 ㅇㅇ. 그 외에도 포스트 작업도 해줘야하고. 음 할거 많네
        }

        // 모달
        setSubWindow(
            createPortal(
                <ConfirmModal
                    ref={modalRef}
                    modalTitle={'시리즈에서 포스트 제거'}
                    modalText={[`시리즈에서 [${post.post_name}] 포스트를 삭제하시겠습니까?`,`(포스트 자체는 삭제되지 않습니다)`]}
                    secondary={{
                        text: '취소',
                        onClick: cancel
                    }}
                    primary={{
                        text: '삭제',
                        onClick: deleteFolder
                    }} />, document.body
            )
        )
    }

    const deleteSeries = useCallback(() => {

        return asyncTaskManager.addAsyncTask(
            createDeleteSeriesAsyncTask(
                {
                    userId: userInfo._id,
                    seriesId: seriesId,
                    seriesName: series.series_name,
                    lastModified: userInfo.last_modified,
                    queryClient,
                    postList: series.post_list, // db에 저장되있는거 기준
                },
                {
                    seriesObj,
                    setSeriesObj: setSeriesObj
                }
            )
        );
    }, [asyncTaskManager, queryClient, series.post_list, series.series_name, seriesId, seriesObj, setSeriesObj, userInfo._id, userInfo.last_modified])

    const updateSeries = useCallback(() => {
        return asyncTaskManager.addAsyncTask(

            createUpdateSeriesAsyncTask(
                {
                    userId: userInfo._id,
                    seriesId: seriesId,
                    seriesName: seriesName,
                    seriesDescription: seriesDescription,
                    postList: postIds,
                    lastModified: userInfo.last_modified,
                    queryClient,
                },
                {
                    seriesObj,
                    setSeriesObj: setSeriesObj
                }
            )
        );
    }, [asyncTaskManager, postIds, queryClient, seriesDescription, seriesId, seriesName, seriesObj, setSeriesObj, userInfo._id, userInfo.last_modified])

    return (
        <div className={styles.window}>
            <div className={styles.series}>
                <div className={styles.seriesContent}>
                    <label className='sr-only' htmlFor='series_name'>시리즈 제목</label>
                    <input id='series_name'
                           type="text"
                           defaultValue={series.series_name}
                           placeholder={"시리즈 이름을 입력해주세요."}
                           maxLength={SERIES_NAME_LIMIT}
                           className={styles.seriesName}
                           onChange={(e) => setSeriesName(e.target.value)}/>
                    <label className='sr-only' htmlFor='series_description'>시리즈 설명</label>
                    <input id='series_description'
                           type="text"
                           defaultValue={series.series_description}
                           placeholder={"시리즈 설명을 입력해주세요."}
                           maxLength={SERIES_DESCRIPTION_LIMIT}
                           className={styles.seriesDescription}
                           onChange={(e) => setSeriesDescription(e.target.value)}/>
                </div>
                <div className={styles.seriesButtons}>
                    <button className={styles.seriesDeleteButton} onClick={deleteSeries}>
                        <span>
                            삭제
                        </span>
                    </button>
                    <button disabled={seriesName === ''} className={styles.seriesEditButton} onClick={updateSeries}>
                        <span>
                            저장
                        </span>
                    </button>
                </div>
            </div>
            <div role="table" className={styles.table}>
                <div role='rowgroup'>
                    <div role='row' className={styles.hRow}>
                        <span role='columnheader' id='col-title' className={styles.col1}>순서</span>
                        <span role='columnheader' id='col-title' className={styles.col3}>포스트 제목</span>
                        <span role='columnheader' id='col-path' className={styles.col3}>포스트 경로</span>
                        <span role='columnheader' id='col-created' className={styles.col2}>생성일시</span>
                        <span role='columnheader' id='col-updated' className={styles.col2}>수정일시</span>
                    </div>
                </div>
                <ul role='rowgroup' className={styles.ul}>
                    {
                        isFetching ? (
                            <li className={styles.otherRow}>
                                불러오는 중
                            </li>
                        ) : isError ? (
                            <li className={styles.otherRow}>
                                {errorMessage}
                            </li>
                        ) : (
                            <>
                                {
                                    data.length < SERIES_POST_LIMIT && (
                                        <li className={styles.otherRow} onClick={() => setOpenPostSelector(true)}>
                                            포스트 추가
                                        </li>
                                    )
                                }
                                {
                                    data.map((post, order) => (
                                        <li role='row' key={post._id + order}
                                            className={styles.bRow}
                                            onClick={() => deletePost(post)} >
                                            <label className='sr-only'>포스트 순서</label>
                                            <input role='cell' id='order' type="number"
                                                   defaultValue={order + 1}
                                                   className={styles.col1}
                                                   onClick={(e) => {
                                                       // 위로 전파되어서 포스트 삭제로 가는거 방지
                                                       e.stopPropagation()
                                                   }}
                                                   onBeforeInput={(e) => {
                                                       const data = Number((e.nativeEvent as InputEvent).data);
                                                       if (!isNaN(data)) {
                                                       } else {
                                                           e.preventDefault()
                                                       }
                                                   }}
                                                   onBlur={(e) => {
                                                       const target = e.target as HTMLInputElement;
                                                       const number = e.target.valueAsNumber;

                                                       const newPostIds = [...postIds];

                                                       if (!isNaN(number)) {
                                                           const t = Math.max(number - 1, 0); // 0-based index
                                                           const t2 = Math.min(t, postIds.length - 1); // 최대 index까지 허용

                                                           newPostIds.splice(order, 1);
                                                           newPostIds.splice(t2, 0, post._id);

                                                           target.value = String(t2 + 1); // 사용자에게는 1-based로 보여줌
                                                       }

                                                       setPostIds(newPostIds);
                                                   }}
                                                   onKeyDown={(e) => {
                                                       if (e.key === 'Enter') {
                                                           e.preventDefault();
                                                           (e.target as HTMLInputElement).blur();
                                                       }
                                                   }}/>
                                        <span role='cell' id='title' className={styles.col3}>
                                            {post.post_name}
                                        </span>
                                        <span role='cell' id='path' className={styles.col3}>
                                            {buildFolderPath(folderObj[post.folder_id], folderObj)}
                                        </span>
                                        <span role='cell' id='created' className={styles.col2}>
                                            {formatDate(new Date(post.post_createdAt), true)}
                                        </span>
                                        <span role='cell' id='updated' className={styles.col2}>
                                            {formatDate(new Date(post.post_updatedAt), true)}
                                        </span>
                                    </li>
                                    ))
                                }
                            </>
                        )
                    }
                </ul>
            </div>
            {
                openPostSelector && (
                    createPortal(
                        <Modal userId={userInfo._id}
                               folderObj={folderObj}
                               seriesId={seriesId}
                               closeModal={() => setOpenPostSelector(false)}
                               setPost={setPost} />,
                        document.body
                    )
                )
            }
            {subWindow}
        </div>
    )
}
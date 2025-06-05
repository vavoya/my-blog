'use client'

import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {MouseEventHandler, useCallback, useMemo, useState} from "react";
import {toObj} from "@/components/modal/utils/toObj";
import WindowProvider from "@/app/management/_window/provider/WindowProvider";
import {WindowObj} from "@/app/management/_window/provider/types";
import {WindowCommandBuilder, WindowCommands} from "@/app/management/_window/provider/utils/windowCommands";
import FolderWindow from "@/app/management/_window/folder/FolderWindow";
import styles from "./background.module.scss"
import createWindowObj from "@/app/management/_window/provider/utils/createWindowObj";
import {QueryClientProvider} from "@tanstack/react-query";
import queryClient from "../_queries";
import ManagementProvider from "@/store/ManagementProvider";
import NewPostWindow from "@/app/management/_window/post/NewPostWindow";
import {buildTrie} from "@/app/management/_utils/buildTrie";
import TaskPanel from "@/app/management/_components/taskPanel/TaskPanel";
import ClientOnly from "@/components/ClientOnly";
import AboutWindow from "@/app/management/_window/about/AboutWindow";


type BackgroundProps = {
    userInfo: UserInfoResponse;
    folderInfo: FolderInfoResponse[];
    seriesInfo: SeriesInfoResponse[];
}
export default function Background({ userInfo, folderInfo, seriesInfo }: BackgroundProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <BackgroundContent userInfo={userInfo} folderInfo={folderInfo} seriesInfo={seriesInfo} />
        </QueryClientProvider>
    )
}

export type SetWindowsToAdd = (windowObjs: WindowObj[]) => void;
export type SetWindows = (windowCommands: WindowCommands) => void;
function BackgroundContent({ userInfo, folderInfo, seriesInfo }: BackgroundProps) {
    const folderObj = toObj(folderInfo);
    const seriesObj = toObj(seriesInfo)
    const trie = useMemo(() => buildTrie(folderObj), [folderObj])


    const [windowCommands, setWindowCommands] = useState<WindowCommands>();

    const setWindows = useCallback<SetWindows>((windowCommands) => {
        setWindowCommands(windowCommands)
    }, [])


    const openFolder = useCallback<MouseEventHandler>(() => {
        const windowCommandBuilder = new WindowCommandBuilder()

        const newCommands = windowCommandBuilder
            .add([
                createWindowObj(
                    'FolderWindow',
                    '폴더 트리',
                    <FolderWindow />,
                )
            ])
            .returnCommand()

        setWindowCommands(newCommands)
    }, [])

    const openSeries = useCallback<MouseEventHandler>(() => {

    }, [])

    const openSetting = useCallback<MouseEventHandler>(() => {

    }, [])

    const openWriting = useCallback<MouseEventHandler>(() => {
        const window = createWindowObj(
            "NewPostWindow",
            "새 포스트 작성",
            <NewPostWindow />,
            0,
            0,
            670,
            450
        )

        const commands = new WindowCommandBuilder().add([
            window
        ]).returnCommand()
        setWindows(commands)
    }, [setWindows])

    const openAbout = useCallback<MouseEventHandler>(() => {
        const window = createWindowObj(
            "AboutWindow",
            "소개글 수정",
            <AboutWindow />,
            0,
            0,
            670,
            450
        )

        const commands = new WindowCommandBuilder().add([
            window
        ]).returnCommand()
        setWindows(commands)
    }, [setWindows])



    return (

            <div className={styles.background}>
            <nav>
                <ul className={styles.ul}>
                    <li>
                        <button tabIndex={0}
                                onClick={openFolder}>
                            <span>폴더 편집</span>
                        </button>
                    </li>
                    <li>
                        <button tabIndex={0}
                                onClick={openSeries}>
                            <span>시리즈 편집</span>
                        </button>
                    </li>
                    <li>
                        <button tabIndex={0}
                                onClick={openWriting}>
                            <span>글쓰기</span>
                        </button>
                    </li>
                    <li>
                        <button tabIndex={0}
                                onClick={openAbout}>
                            <span>소개글</span>
                        </button>
                    </li>
                    <li>
                        <button tabIndex={0}
                                onClick={openSetting}>
                            <span>설정</span>
                        </button>
                    </li>
                </ul>
            </nav>
            <main>
                <ManagementProvider userInfo={userInfo} folderObj={folderObj} seriesObj={seriesObj} trie={trie} setWindows={setWindows}>
                    <WindowProvider commands={windowCommands}/>
                </ManagementProvider>
                <ClientOnly>
                    <TaskPanel/>
                </ClientOnly>
            </main>
        </div>
    )
}
'use client'

import React, {MouseEvent, MouseEventHandler, ReactNode, useMemo, useRef, useState} from "react";
import buildFolderChildrenMap from "@/app/management/_utils/buildFolderChildrenMap";
import TreeBranch from "@/app/management/_window/folder/TreeBranch/TreeBranch";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {SetWindows} from "@/app/management/_components/Background";
import createWindowObj from "@/app/management/_window/provider/utils/createWindowObj";
import styles from "./folderWindow.module.css"
import PostListWindow from "@/app/management/_window/postList/PostListWindow";
import FolderOptionModal from "@/app/management/_window/folder/components/FolderOptionModal";
import RemoveModal from "@/app/management/_window/folder/components/RemoveModal";
import {createPortal} from "react-dom";
import NameChangeModal from "@/app/management/_window/folder/components/NameChangeModal";
import MoveModal from "@/app/management/_window/folder/components/MoveModal";
import useRootMouseDownOutside from "@/hook/useRootMouseDownOutside";
import AddFolderModal from "@/app/management/_window/folder/components/AddFolderModal";
import {useManagementStore} from "@/store/ManagementProvider";
import {WindowCommandBuilder} from "@/app/management/_window/provider/utils/windowCommands";
import useAsyncTaskManager from "@/hook/useAsyncTaskManager";
import {createAddFolderAsyncTask} from "@/app/management/_window/folder/handlers/createAddFolderAsyncTask";
import {createMoveFolderAsyncTask} from "@/app/management/_window/folder/handlers/createMoveFolderAsyncTask";
import {createRenameFolderAsyncTask} from "@/app/management/_window/folder/handlers/createRenameFolderAsyncTask";
import {createDeleteFolderAsyncTask} from "@/app/management/_window/folder/handlers/createDeleteFolderAsyncTask";

export type RenameFolder = (newName: FolderInfoResponse['folder_name']) => void;
export type MoveFolder = (pFolderId: FolderInfoResponse['_id']) => void;
export type AddFolder = (name: FolderInfoResponse['folder_name']) => void;
export type OpenOption = (e: MouseEvent, folderId: FolderInfoResponse["_id"]) => void;
export type OpenFolder = (e: MouseEvent, folderId: FolderInfoResponse["_id"]) => void;
export default function FolderWindow() {
    const asyncTaskManager = useAsyncTaskManager();
    const folderObj = useManagementStore((state) => state.folderObj);
    const setFolderObj = useManagementStore((state) => state.setFolderObj);
    const setTrie = useManagementStore((state) => state.setTrie);
    const userInfo = useManagementStore((state) => state.userInfo);
    const setWindows = useManagementStore<SetWindows>((state) => state.setWindows);
    const folderChildrenMap = useMemo(() => buildFolderChildrenMap(folderObj), [folderObj])
    const [subWindow, setSubWindow] = useState<ReactNode>();
    const windowRef = useRef<HTMLDivElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)
    useRootMouseDownOutside(modalRef, () => setSubWindow(null))

    const getRootId = () => {
        for (const folderId in folderObj) {
            if (!folderObj[folderId].pfolder_id) {
                return folderId;
            }
        }
        return null;
    }
    const rootId = getRootId();

    const openFolder: OpenFolder = (e, folderId) => {
        e.stopPropagation()
        const windowName = `[${folderObj[folderId].folder_name}] - 포스트 목록`;
        const windowObj = createWindowObj(`PostListWindow-${folderId}`, windowName, <></>, 0, 0, 650)

        windowObj.node = <PostListWindow folderId={folderId} windowObj={windowObj}/>;

        const commands = new WindowCommandBuilder().add([
            windowObj
        ]).returnCommand()

        setWindows(commands)
    }

    const openOption: OpenOption = (e, folderId) => {
        const rect = windowRef.current!.getBoundingClientRect();
        const width = 110;
        const height = 24 * 4;
        const x = e.clientX - rect.x - ((e.clientX + width <= rect.right) ? 0 : width)
        const y = e.clientY - rect.y - ((e.clientY + height <= rect.bottom) ? 0 : height)

        const cancel: MouseEventHandler = () => {
            setSubWindow(null);
        }

        const renameFolder: MouseEventHandler = () => {
            const renameFolder: RenameFolder = (newName) => {
                asyncTaskManager.addAsyncTask(createRenameFolderAsyncTask({
                    userId: userInfo._id,
                    folderId: folderId,
                    folderName: folderObj[folderId].folder_name,
                    newFolderName: newName,
                    lastModified: userInfo.last_modified
                }, {
                    setTrie,
                    setFolderObj,
                    folderObj,
                }))
                setSubWindow(null);
            }

            // 모달
            setSubWindow(
                createPortal(
                    <NameChangeModal
                        ref={modalRef}
                        name={folderObj[folderId].folder_name}
                        renameFolder={renameFolder}
                        cancel={cancel}/>, document.body
                )
            )
        }
        const deleteFolder: MouseEventHandler = () => {
            const deleteFolder: MouseEventHandler = () => {
                asyncTaskManager.addAsyncTask(createDeleteFolderAsyncTask({
                    userId: userInfo._id,
                    folderId: folderId,
                    folderName: folderObj[folderId].folder_name,
                    lastModified: userInfo.last_modified
                }, {
                    setTrie,
                    setFolderObj,
                    folderObj
                }))
                setSubWindow(null);
                // 여기는 윈도우 삭제, 삭제가 서버까지 성공하면 ㅇㅇ. 그 외에도 포스트 작업도 해줘야하고. 음 할거 많네
            }

            // 모달
            setSubWindow(
                createPortal(
                    <RemoveModal
                        ref={modalRef}
                        name={folderObj[folderId].folder_name}
                        deleteFolder={deleteFolder}
                        cancel={cancel}/>, document.body
                )
            )
        }
        const moveFolder: MouseEventHandler = () => {
            const moveFolder: MoveFolder = (pFolderId) => {
                asyncTaskManager.addAsyncTask(createMoveFolderAsyncTask({
                    userId: userInfo._id,
                    folderId: folderId,
                    pFolderId: pFolderId,
                    folderName: folderObj[folderId].folder_name,
                    lastModified: userInfo.last_modified
                }, {
                    setTrie,
                    setFolderObj,
                    folderObj
                }));
                setSubWindow(null);
            }

            // 모달
            setSubWindow(
                createPortal(
                    <MoveModal
                        ref={modalRef}
                        folderObj={folderObj}
                        name={folderObj[folderId].folder_name}
                        moveFolder={moveFolder}
                        cancel={cancel}/>, document.body
                )
            )
        }
        const addFolder: MouseEventHandler = () => {
            const addFolder: AddFolder = (name) => {
                asyncTaskManager.addAsyncTask(createAddFolderAsyncTask({
                    userId: userInfo._id,
                    folderName: name,
                    pFolderId: folderId,
                    lastModified: userInfo.last_modified
                }, {
                    setTrie,
                    setFolderObj,
                    folderObj
                }));
                setSubWindow(null);
            }

            // 하위 폴더 추가
            setSubWindow(
                createPortal(
                    <AddFolderModal
                        ref={modalRef}
                        name={folderObj[folderId].folder_name}
                        addFolder={addFolder}
                        cancel={cancel}/>, document.body
                )
            )
        }

        setSubWindow(
            <FolderOptionModal ref={modalRef} x={x} y={y}
                               isRoot={!folderObj[folderId].pfolder_id}
                               renameFolder={renameFolder}
                               deleteFolder={deleteFolder}
                               moveFolder={moveFolder}
                               addFolder={addFolder}/>
        )
    }

    return (
        <div ref={windowRef} className={styles.folderWindow}>
            {
                rootId && (
                    <TreeBranch folderObj={folderObj} folderChildrenMap={folderChildrenMap} folderId={rootId} openOption={openOption} openFolder={openFolder} />
                )
            }
            {subWindow}
        </div>
    )
}
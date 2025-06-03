'use client'

import styles from "@/components/sideBar/sideBar.module.scss";
import React, {useState} from "react";
import {createPortal} from "react-dom";
import {IconLabel} from "@/components/sideBar/folder/IconLabel";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Url} from "@/components/sideBar/types";
import {PageNumberResult} from "@/models/pagination/pageNum/type";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import Modal from "@/components/modal/folder/Modal";

type NavButtonProps = {
    userId: UserInfoResponse['_id'];
    url: Url;
    initPageNumber: PageNumberResult['pageNumber'];
    initFolderId: FolderInfoResponse['_id'];
    folderInfo: FolderInfoResponse[];
}

export function NavButton({userId, url, initPageNumber, initFolderId, folderInfo}: NavButtonProps ) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <button
            className={styles.button}
            onClick={openModal}>
            <IconLabel />
            {isModalOpen && createPortal(
                <div style={{
                    position: "absolute",
                    display: "block",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                }}>
                    <Modal
                        userId={userId}
                        url={url}
                        initPageNumber={initPageNumber}
                        initFolderId={initFolderId}
                        folderInfo={folderInfo}
                        closeModal={closeModal} />
                </div>,
                document.body
            )}
        </button>
    )

}



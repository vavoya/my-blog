'use client'

import styles from "@/components/sideBar/sideBar.module.scss";
import React, {useState} from "react";
import {createPortal} from "react-dom";
import {IconLabel} from "@/components/sideBar/series/IconLabel";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Url} from "@/components/sideBar/types";
import {PageNumberResult} from "@/models/pagination/pageNum/type";
import Modal from "@/components/modal/series/Modal";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";

type NavButtonProps = {
    userId: UserInfoResponse['_id'];
    url: Url;
    initPageNumber: PageNumberResult['pageNumber'];
    initSeriesId: SeriesInfoResponse['_id'] | null;
    seriesInfo: SeriesInfoResponse[];
    folderInfo: FolderInfoResponse[];
}

export function NavButton({userId, url, initPageNumber, initSeriesId, seriesInfo, folderInfo}: NavButtonProps ) {
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
                        initSeriesId={initSeriesId}
                        seriesInfo={seriesInfo}
                        folderInfo={folderInfo}
                        closeModal={closeModal} />
                </div>,
                document.body
            )}
        </button>
    )

}



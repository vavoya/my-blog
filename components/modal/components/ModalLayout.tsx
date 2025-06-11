import styles from "@/components/modal/components/modal.module.scss";
import SvgClose from "@/components/svg/Close";
import React, {ReactElement, useEffect, useState} from "react";
import NavOpenButton from "@/components/modal/components/navButton/NavOpenButton";
import NavCloseButton from "@/components/modal/components/navButton/NavCloseButton";
import {QueryClientProvider} from "@tanstack/react-query";
import {QueryClient} from "@tanstack/query-core";

// Modal 컴포넌트의 props 타입 정의
export interface ModalLayoutProps {
    closeModal: () => void;
    NavHeader: ReactElement;
    NavBody: ReactElement;
    CardSection: ReactElement;
    queryClient: QueryClient;
}

export default function ModalLayout({closeModal, NavHeader, NavBody, CardSection, queryClient}: ModalLayoutProps) {
    const [ navOpen, setNavOpen ] = useState(false);


    useEffect(() => {
        // esc 키로 모달 닫기
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
                event.preventDefault();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        // html 페이지 스크롤 막기
        const html = document.documentElement; // document.html 대신 document.documentElement 사용
        html.style.overflow = 'hidden';

        return () => {
            html.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [closeModal]);

    return (
        <QueryClientProvider client={queryClient}>
            <Backdrop closeModal={closeModal}>
                <ModalContainer>
                    <div className={`${styles.modalNavSection} ${navOpen ? styles.open : ''}` }>
                        <div className={styles.modalNavHeader}>
                            {NavHeader}
                        </div>
                        <div className={styles.modalNavBody}>
                            {NavBody}
                        </div>
                        <NavCloseButton onClick={() => setNavOpen(false)}/>
                    </div>
                    <div className={styles.modalCardSection}>
                        {CardSection}
                    </div>
                    <button
                        onClick={closeModal}
                        className={styles.modalCloseButton}>
                        <SvgClose />
                    </button>
                    <NavOpenButton onClick={() => setNavOpen(true)}/>
                </ModalContainer>
            </Backdrop>
        </QueryClientProvider>
    )
}


function Backdrop({children, closeModal}: { children: React.ReactNode, closeModal: () => void }) {

    return (
        <div
            onClick={e => {
                e.stopPropagation()
                closeModal()
            }}
            className={styles.backdrop}>
            {children}
        </div>
    )
}

function ModalContainer({children}: {children: React.ReactNode}) {

    return (
        <div
            onClick={e => {
                e.stopPropagation()
            }}
            className={styles.modalContainer}>
            {children}
        </div>
    )
}
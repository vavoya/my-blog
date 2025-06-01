import styles from "@/components/modal/components/modal.module.scss";
import styles2 from "@/components/modal/components/NavItem.module.css";
import MoveBackgroundAnimation from "@/components/modal/components/MoveBackgroundAnimation";
import {useEffect, useRef, useState, MouseEvent} from "react";

type NavItemProps = {
    name: string;
    postCount: number | null;
    onClick: (e: MouseEvent) => void;
    isSelected?: boolean;
}

export default function NavItem({name, postCount, onClick, isSelected}: NavItemProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);


    return (
        <button
            ref={ref}
            className={`${styles.modalNavItem} ${isSelected ? styles.modalNavItemClick : ''}`}
            onClick={onClick}>
            {isMounted && <MoveBackgroundAnimation width={ref.current!.offsetWidth} height={ref.current!.offsetHeight}/>}
            <div className={styles2.name}>
                <span>
                    {name}
                </span>
            </div>
            <span className={styles2.count}>
                {postCount}
            </span>
        </button>
    )
}
import styles from "@/components/modal/components/navButton/navButton.module.scss";
import {MouseEventHandler} from "react";
import SvgPrev from "@/components/svg/Prev";


type NavCloseButtonProps = {
    onClick: MouseEventHandler;
}
export default function NavCloseButton({ onClick }: NavCloseButtonProps) {


    return (
        <button className={styles.close} onClick={onClick}>
            <SvgPrev width={14} height={14} />
        </button>
    )
}
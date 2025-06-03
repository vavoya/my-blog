import SvgNext from "@/components/svg/Next";
import styles from "./navButton.module.scss";
import {MouseEventHandler} from "react";


type NavOpenButtonProps = {
    onClick: MouseEventHandler;
}
export default function NavOpenButton({ onClick }: NavOpenButtonProps) {


    return (
        <button className={styles.open} onClick={onClick}>
            <SvgNext width={14} height={14} />
        </button>
    )
}
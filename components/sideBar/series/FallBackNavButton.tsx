import styles from "@/components/sideBar/sideBar.module.css";
import {IconLabel} from "@/components/sideBar/series/IconLabel";

export default function FallBackButton() {

    return (
        <button className={styles.fallback}>
            <IconLabel />
        </button>
    )
}
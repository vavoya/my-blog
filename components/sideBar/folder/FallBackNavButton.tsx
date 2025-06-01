import styles from "@/components/sideBar/sideBar.module.css";
import {IconLabel} from "@/components/sideBar/folder/IconLabel";

export default function FallBackNavButton() {

    return (
        <button className={styles.fallback}>
            <IconLabel />
        </button>
    )
}
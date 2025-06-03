
import styles from "@/components/sideBar/sideBar.module.scss";
import React from "react";
import {IconLabel} from "@/components/sideBar/menu/IconLabel";

export default function MenuNavButton() {

    return (
        <button className={styles.menuButton}>
            <IconLabel />
        </button>
    )
}




import styles from "@/components/sideBar/sideBar.module.scss";
import React from "react";
import {IconLabel} from "@/components/sideBar/setting/IconLabel";
import {auth} from "@/auth";
import Link from "next/link";

export default async function SettingNavButton() {
    const session = await auth();

    if (session?.userId) {
        return (
            <Link href={'/management'}
                  className={styles.settingButton}>
                <IconLabel />
            </Link>
        )
    }

    return null
}



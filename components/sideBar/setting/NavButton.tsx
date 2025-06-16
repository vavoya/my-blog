
import styles from "@/components/sideBar/sideBar.module.scss";
import React from "react";
import {IconLabel} from "@/components/sideBar/setting/IconLabel";
import {auth} from "@/auth";
import ProcessingOverlayLink from "@/components/ProcessingOverlayLink";

export default async function SettingNavButton() {
    const session = await auth();

    if (session?.isLogin && session?.userId) {
        return (
            <ProcessingOverlayLink href={'/management'}
                  className={styles.settingButton}>
                <IconLabel />
            </ProcessingOverlayLink>
        )
    }

    return null
}



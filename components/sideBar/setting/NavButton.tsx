
import styles from "@/components/sideBar/sideBar.module.css";
import React from "react";
import {IconLabel} from "@/components/sideBar/setting/IconLabel";
import {auth} from "@/auth";
import Link from "next/link";

export async function NavButton() {
    const session = await auth();

    if (session?.userId) {
        return (
            <Link href={'/management'}
                  className={styles.button}>
                <IconLabel />
            </Link>
        )
    }

    return null
}



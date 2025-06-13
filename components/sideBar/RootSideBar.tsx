
import styles from "./sideBar.module.scss";
import SettingNavButton from "@/components/sideBar/setting/NavButton";
import MenuNavButton from "@/components/sideBar/menu/NavButton";


export default function RootSideBar() {

    return (
        <nav className={styles.nav}>
            <ul className={styles.ul}>
                <li>
                    <SettingNavButton />
                </li>
            </ul>
            <MenuNavButton />
        </nav>
    )
}



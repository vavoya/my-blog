
import styles from "./sideBar.module.scss";
import SettingNavButton from "@/components/sideBar/setting/NavButton";


export default function RootSideBar() {

    return (
        <nav className={styles.nav}>
            <SettingNavButton />
        </nav>
    )
}



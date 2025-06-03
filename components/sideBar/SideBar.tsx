
import styles from "./sideBar.module.scss";
import FolderNavButton from "@/components/sideBar/folder/SuspenseNavButton";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Url} from "@/components/sideBar/types";
import SeriesNavButton from "@/components/sideBar/series/SuspenseNavButton";
import SettingNavButton from "@/components/sideBar/setting/NavButton";
import MenuNavButton from "@/components/sideBar/menu/NavButton";


export default function SideBar({url, userId}: {url: Url, userId: UserInfoResponse['_id']}) {

    return (
        <nav className={styles.nav}>
            <ul className={styles.ul}>
                <li>
                    <FolderNavButton url={url} userId={userId} />
                </li>
                <li>
                    <SeriesNavButton url={url} userId={userId} />
                </li>
                <li>
                    <SettingNavButton />
                </li>
            </ul>
            <MenuNavButton />
        </nav>
    )
}



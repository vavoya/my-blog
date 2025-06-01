
import styles from "@/components/modal/series/SeriesOrderBox.module.css";



export default function SeriesOrderBox({sereisOrder}: {sereisOrder: number}) {



    return (
        <div className={styles.box}>
            <span className={styles.order}>
                {sereisOrder}
            </span>
        </div>
    )
}
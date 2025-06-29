
import styles from "@/components/modal/series/SeriesOrderBox.module.css";



export default function SeriesOrderBox({seriesOrder}: {seriesOrder: number}) {



    return (
        <div className={styles.box}>
            <span className={styles.order}>
                {seriesOrder}
            </span>
        </div>
    )
}
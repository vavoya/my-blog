import styles from "@/components/modal/components/modal.module.scss";
import React from "react";

export default function MoveBackgroundAnimation({width, height}: {width: number, height: number}) {

    return (
        <div className={styles.moveBackgroundAnimation}
             style={{
                 "--modalItme-svg-width": `${height}px`,
                 "--modalItem-animation-time": `${height / 35}s`,
                 backgroundSize: width < height ? "cover" : "contain",
             } as React.CSSProperties}/>
    )
}
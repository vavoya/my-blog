import styles from "./ProcessingOverlay.module.css"


export default function ProcessingOverlay({text, onClick}: {text: string, onClick: () => void}) {


    return (
        <div className={styles.container}>
            <button onClick={onClick}>
                {text}
            </button>
        </div>
    )
}
import {ChangeEventHandler} from "react";
import styles from "./input.module.scss"

type InputProps = {
    id: string;
    title: string;
    maxLength?: number;
    errorText?: string;
    placeholder?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    value?: string,
    readonly?: boolean
    beforeText?: string;
}
export default function Input({id, title, maxLength, placeholder, onChange, errorText, value, readonly, beforeText}: InputProps) {


    return (
        <section className={styles.inputBox}>
            <label className='sr-only' htmlFor={id}>{title}</label>
            <h2 className={styles.title}>{title}</h2>
            <div>
                <span>{beforeText}</span>
                <input className={styles.input} type={"text"} maxLength={maxLength} id={id} readOnly={readonly} defaultValue={value} placeholder={placeholder} onChange={onChange} />
            </div>
            {
                errorText && (
                    <span className={styles.error}>{errorText}</span>
                )
            }
        </section>
    )
}

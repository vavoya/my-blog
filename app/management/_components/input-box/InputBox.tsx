import styles from "./inputBox.module.css";
import {ReactNode} from "react";

type InputBoxProps = {
    title: string;
    placeholder: string;
    defaultValue: string;
    onChange?: (value: string) => void;
    onBlur?: (value: string) => void;
    maxLength?: number;
} | {
    title: string;
    children: ReactNode;
}
export default function InputBox(props: InputBoxProps) {

    return (
        <div className={styles.inputBox}>
            <h3 className={styles.inputTitle}>
                { props.title }
            </h3>
            {
                'children' in props ? (
                    props.children
                ) : (
                    <>
                        <label className={'sr-only'} htmlFor={props.title}>{ props.title }</label>
                        <input className={styles.inputText}
                               id={props.title}
                               placeholder={props.placeholder}
                               defaultValue={props.defaultValue}
                               onBlur={(e) => props.onBlur?.(e.target.value)}
                               onChange={(e) => props.onChange?.(e.target.value)}
                               type="text"
                               maxLength={props.maxLength}/>
                    </>
                )
            }
        </div>
    )
}
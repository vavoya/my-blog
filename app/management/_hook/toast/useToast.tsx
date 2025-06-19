
import {createRoot} from "react-dom/client";
import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import styles from "./toast.module.css"


// 이거는 ClientOnly 아래에 선언해줘야한다.
// document 때문에
const toastContainer = document.createElement('div');
toastContainer.className = styles.toastContainer;
toastContainer.id = 'toast-container';
document.body.appendChild(toastContainer)
const root = createRoot(toastContainer)
root.render(<ToastManager />) // ToastManager는 render 대상 컴포넌트

const handler = () => {
    root.unmount()
    toastContainer.remove()
}

window.addEventListener('popstate', handler, { once: true })




type AddToast = (toastObj: ToastObj) => void
const addToastRef = {
    addToast: (toastObj: ToastObj) => {
        console.log('not mounted', toastObj)
    }
}
/**
 *
 * @Return: addToast {
 *     id: new Date().toISOString()
 *     message: 메세지,
 *     height: 0 (디폴트 고정),
 *     type: success | error | warning | info
 * }
 */
export default function useToast() {
    return useCallback<AddToast>((toastObj) => {
        addToastRef.addToast(toastObj)
    }, []);
}


type ToastObj = {
    type: 'success' | 'error' | 'info' | 'warning'
    message: string,
    id: string,
    height: number,
}
function ToastManager() {
    const [ toastObjs, setToastObjs ] = useState<Set<ToastObj>>(new Set())

    addToastRef.addToast = useCallback<AddToast>((toastObj: ToastObj) => {
        toastObj.height = 0;
        setToastObjs((prevState) => new Set([...prevState, toastObj]))
    }, []);

    let toastY = 0;

    return (
        [...toastObjs].reverse().map((toastObj) => {
            toastY += toastObj.height;
            // 토스트 간격
            if (toastObj.height > 0) {
                toastY += 10;
            }
            return (
                <ToastItem transformY={toastY} toastObj={toastObj} setToastObjs={setToastObjs}
                           key={toastObj.id} {...toastObj} />
            )
        })
    )
}

const classNameMap = {
    success: styles.toastSuccess,
    error: styles.toastError,
    info: styles.toastInfo,
    warning: styles.toastWarning,
}
type ToastItemProps = Omit<ToastObj, 'height'> & {
    transformY: number;
    setToastObjs: Dispatch<SetStateAction<Set<ToastObj>>>
    toastObj: ToastObj;
}
function ToastItem({ type, message, id, transformY, toastObj, setToastObjs }: ToastItemProps) {
    const toastRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!toastRef.current) return;

        toastObj.height = toastRef.current.offsetHeight;
        setToastObjs((prevState) => new Set(prevState));

        const ti = setTimeout(() => {
            setToastObjs((prevState) => {
                const newState = new Set(prevState)
                newState.delete(toastObj);
                return new Set(newState)
            })
        }, 4300)

        return () => {
            clearTimeout(ti)
        }
    }, [setToastObjs, toastObj]);

    return (
        <div key={id}
             ref={toastRef}
             style={{
                 transform: `translate(-50%, -${transformY}px)`
             }}
             className={`${styles.toastBase} ${classNameMap[type]}`}>
            {message}
        </div>
    )
}
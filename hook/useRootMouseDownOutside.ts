import {RefObject, useEffect} from "react";
import {Callback, getRootMouseEventManager} from "@/lib/RootMouseEventManager";

export default function useRootMouseDownOutside(ref: RefObject<HTMLElement | null>, onOutside: (event: MouseEvent) => void) {
    useEffect(() => {
        const rootMouseEventManager = getRootMouseEventManager()

        const callback: Callback = (e) => {
            if (ref.current && ref.current.contains(e.target as Node)) {
                return; // 내부 클릭은 무시
            }
            onOutside(e);
        }

        rootMouseEventManager.subscribe('mousedown', callback)

        return () => {
            rootMouseEventManager.unsubscribe('mousedown', callback)
        }
    }, [ref, onOutside])
}

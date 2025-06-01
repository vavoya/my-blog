import {PointerEventHandler, RefObject, useCallback, useRef} from "react";
import {Layout} from "@/app/management/_window/provider/WindowLayout";


type Position = {
    x: number;
    y: number;
}
type UsePositionProps = {
    headRef: RefObject<HTMLDivElement | null>;
    nextLayout: RefObject<Layout>
}
export default function usePosition({headRef, nextLayout}: UsePositionProps) {
    const pointerStart = useRef<Position>({ x: 0, y: 0 });
    const baseLayout = useRef<Layout>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const onPointerDown = useCallback<PointerEventHandler<HTMLDivElement>>((e) => {
        pointerStart.current = { x: e.clientX, y: e.clientY };
        baseLayout.current = {...nextLayout.current}
        headRef.current!.setPointerCapture(e.pointerId);
        headRef.current!.style.cursor = "grabbing";
    }, [headRef, nextLayout])

    const onPointerMove = useCallback<PointerEventHandler<HTMLDivElement>>((e) => {
        if (!headRef.current!.hasPointerCapture(e.pointerId)) return;

        nextLayout.current.x = Math.max(baseLayout.current.x + e.clientX - pointerStart.current.x, 0);
        nextLayout.current.y = Math.max(baseLayout.current.y + e.clientY - pointerStart.current.y, 0);

        // selection 방지
        e.preventDefault();
    }, [baseLayout, headRef, nextLayout])

    const onPointerUp = useCallback<PointerEventHandler<HTMLDivElement>>((e) => {
        headRef.current!.releasePointerCapture(e.pointerId);
        headRef.current!.style.cursor = "grab";
    }, [headRef])

    return {
        positionHandler: {
            onPointerDown,
            onPointerMove,
            onPointerUp,
        }
    }
}
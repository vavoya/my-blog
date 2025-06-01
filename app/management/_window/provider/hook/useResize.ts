import {PointerEvent, PointerEventHandler, RefObject, useCallback, useRef} from "react";
import {Layout} from "@/app/management/_window/provider/WindowLayout";
import {MIN_HEIGHT, MIN_WIDTH} from "@/app/management/_window/provider/const";

type Position = {
    x: number;
    y: number;
}

const getNextX = (e: PointerEvent, baseLayout: RefObject<Layout>, pointerStart: RefObject<Position>) => {
    const maxX = baseLayout.current.x + baseLayout.current.width - MIN_WIDTH
    return Math.min(Math.max(baseLayout.current.x + (e.clientX - pointerStart.current.x), 0), maxX);
}
const getNextWidthLeft = (e: PointerEvent, baseLayout: RefObject<Layout>, pointerStart: RefObject<Position>) => {
    return Math.max(baseLayout.current.width + (baseLayout.current.x - getNextX(e, baseLayout, pointerStart)), MIN_WIDTH);
}
const getNextWidthRight = (e: PointerEvent, baseLayout: RefObject<Layout>, pointerStart: RefObject<Position>) => {
    return Math.max(baseLayout.current.width + (e.clientX - pointerStart.current.x), MIN_WIDTH);
}
const getNextHeight = (e: PointerEvent, baseLayout: RefObject<Layout>, pointerStart: RefObject<Position>) => {
    return Math.max(baseLayout.current.height + (e.clientY - pointerStart.current.y), MIN_HEIGHT);
}



type UseResizeProps = {
    ref: {
        left: RefObject<HTMLDivElement | null>;
        right: RefObject<HTMLDivElement | null>;
        bottom: RefObject<HTMLDivElement | null>;
        leftBottom: RefObject<HTMLDivElement | null>;
        rightBottom: RefObject<HTMLDivElement | null>;
    };
    nextLayout: RefObject<Layout>;
}
export default function useResize({ref, nextLayout}: UseResizeProps) {
    const pointerStart = useRef<Position>({ x: 0, y: 0 });
    const baseLayout = useRef<Layout>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const left = {
        onPointerDown: useCallback<PointerEventHandler>((e) => {
            pointerStart.current = { x: e.clientX, y: e.clientY };
            baseLayout.current = {...nextLayout.current}
            ref.left.current!.setPointerCapture(e.pointerId);
        }, [nextLayout, ref.left]),
        onPointerMove: useCallback<PointerEventHandler>((e) => {
            if (!ref.left.current!.hasPointerCapture(e.pointerId)) return;

            nextLayout.current.x = getNextX(e, baseLayout, pointerStart);
            nextLayout.current.width = getNextWidthLeft(e, baseLayout, pointerStart);

            // selection 방지
            e.preventDefault();
        }, [nextLayout, ref.left]),
        onPointerUp: useCallback<PointerEventHandler>((e) => {
            ref.left.current!.releasePointerCapture(e.pointerId);
        }, [ref.left])
    }
    const right = {
        onPointerDown: useCallback<PointerEventHandler>((e) => {
            pointerStart.current = { x: e.clientX, y: e.clientY };
            baseLayout.current = {...nextLayout.current}
            ref.right.current!.setPointerCapture(e.pointerId);
        }, [nextLayout, ref.right]),
        onPointerMove: useCallback<PointerEventHandler>((e) => {
            if (!ref.right.current!.hasPointerCapture(e.pointerId)) return;

            nextLayout.current.width = getNextWidthRight(e, baseLayout, pointerStart)

            // selection 방지
            e.preventDefault();
        }, [nextLayout, ref.right]),
        onPointerUp: useCallback<PointerEventHandler>((e) => {
            ref.right.current!.releasePointerCapture(e.pointerId);
        }, [ref.right])
    }
    const bottom = {
        onPointerDown: useCallback<PointerEventHandler>((e) => {
            pointerStart.current = { x: e.clientX, y: e.clientY };
            baseLayout.current = {...nextLayout.current}
            ref.bottom.current!.setPointerCapture(e.pointerId);
        }, [nextLayout, ref.bottom]),
        onPointerMove: useCallback<PointerEventHandler>((e) => {
            if (!ref.bottom.current!.hasPointerCapture(e.pointerId)) return;

            nextLayout.current.height = getNextHeight(e, baseLayout, pointerStart)

            // selection 방지
            e.preventDefault();
        }, [nextLayout, ref.bottom]),
        onPointerUp: useCallback<PointerEventHandler>((e) => {
            ref.bottom.current!.releasePointerCapture(e.pointerId);
        }, [ref.bottom])
    }
    const leftBottom = {
        onPointerDown: useCallback<PointerEventHandler>((e) => {
            pointerStart.current = { x: e.clientX, y: e.clientY };
            baseLayout.current = {...nextLayout.current}
            ref.leftBottom.current!.setPointerCapture(e.pointerId);
        }, [nextLayout, ref.leftBottom]),
        onPointerMove: useCallback<PointerEventHandler>((e) => {
            if (!ref.leftBottom.current!.hasPointerCapture(e.pointerId)) return;

            nextLayout.current.x = getNextX(e, baseLayout, pointerStart);
            nextLayout.current.height = getNextHeight(e, baseLayout, pointerStart);
            nextLayout.current.width = getNextWidthLeft(e, baseLayout, pointerStart);

            // selection 방지
            e.preventDefault();
        }, [nextLayout, ref.leftBottom]),
        onPointerUp: useCallback<PointerEventHandler>((e) => {
            ref.leftBottom.current!.releasePointerCapture(e.pointerId);
        }, [ref.leftBottom])
    }
    const rightBottom = {
        onPointerDown: useCallback<PointerEventHandler>((e) => {
            pointerStart.current = { x: e.clientX, y: e.clientY };
            baseLayout.current = {...nextLayout.current}
            ref.rightBottom.current!.setPointerCapture(e.pointerId);
        }, [nextLayout, ref.rightBottom]),
        onPointerMove: useCallback<PointerEventHandler>((e) => {
            if (!ref.rightBottom.current!.hasPointerCapture(e.pointerId)) return;

            nextLayout.current.height = getNextHeight(e, baseLayout, pointerStart);
            nextLayout.current.width = getNextWidthRight(e, baseLayout, pointerStart);

            // selection 방지
            e.preventDefault();
        }, [nextLayout, ref.rightBottom]),
        onPointerUp: useCallback<PointerEventHandler>((e) => {
            ref.rightBottom.current!.releasePointerCapture(e.pointerId);
        }, [ref.rightBottom])
    }

    return {
        resizeHandler: {
            left,
            right,
            bottom,
            leftBottom,
            rightBottom,
        }
    }
}
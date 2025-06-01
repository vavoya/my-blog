
import {
    ReactNode, useEffect,
    useRef,
} from "react";
import styles from "./windowLayout.module.scss"
import SvgClose from "@/components/svg/Close";
import usePosition from "@/app/management/_window/provider/hook/usePosition";
import frameScheduler from "@/app/management/_window/provider/WindowDrawManager";
import useResize from "@/app/management/_window/provider/hook/useResize";


export type Layout = {
    x: number;
    y: number;
    width: number;
    height: number;
}
type WindowLayoutProps = {
    zIndex: number;
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    deleteWindow: () => void;
    onFocusChange: () => void;
    isFocused?: boolean;
    children: ReactNode;
}
export default function WindowLayout({zIndex, x, y, width, height, name, deleteWindow, onFocusChange, isFocused = false, children}: WindowLayoutProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<HTMLDivElement>(null);
    const nextLayout = useRef<Layout>({
        x,
        y,
        width,
        height
    });
    const currentLayout = useRef<Layout>({
        x,
        y,
        width,
        height
    });
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const leftBottomRef = useRef<HTMLDivElement>(null);
    const rightBottomRef = useRef<HTMLDivElement>(null);

    const {positionHandler} = usePosition({headRef, nextLayout})
    const {resizeHandler} = useResize({
        ref: {
            left: leftRef,
            right: rightRef,
            bottom: bottomRef,
            leftBottom: leftBottomRef,
            rightBottom: rightBottomRef,
        }, nextLayout})

    useEffect(() => {
        const el = elementRef.current!;
        el.style.transform = `translate(${currentLayout.current.x}px, ${currentLayout.current.y}px)`;
        el.style.width = `${currentLayout.current.width}px`;
        el.style.height = `${currentLayout.current.height}px`;

        const updateStyle = () => {
            /*
            const currentX = currentLayout.current.x;
            const currentY = currentLayout.current.y;
            const currentWidth = currentLayout.current.width;
            const currentHeight = currentLayout.current.height;

             */

            const nextX = nextLayout.current.x;
            const nextY = nextLayout.current.y;
            const nextWidth = nextLayout.current.width;
            const nextHeight = nextLayout.current.height

            const isEqual = (Object.keys(currentLayout.current) as (keyof Layout)[]).every(key => currentLayout.current[key] === nextLayout.current[key]);
            if (isEqual) return;

            // 이동 거리 계산
            //const dx = nextX - currentX;
            //const dy = nextY - currentY;
            //const distance = Math.sqrt(dx * dx + dy * dy);

            // 거리 비례 시간 (최소 0.05s, 최대 0.5s)
            //const pixelsPerSecond = 1000;
            //const duration = Math.max(0.05, Math.min(0.5, distance / pixelsPerSecond));

            const el = elementRef.current!;

            // 트랜지션 설정
            //el.style.transition = `transform ${duration}s ease`;

            // 위치 적용 (애니메이션 시작)
            el.style.transform = `translate(${nextX}px, ${nextY}px)`;
            el.style.width = `${nextWidth}px`;
            el.style.height = `${nextHeight}px`;

            // 현재 값 갱신
            currentLayout.current = {
                x: nextX,
                y: nextY,
                width: nextWidth,
                height: nextHeight,
            }
        };

        frameScheduler.addTask(updateStyle)

        return () => {
            frameScheduler.removeTask(updateStyle)
        }
    }, [elementRef]);


    return (
        <div style={{zIndex: zIndex}} className={isFocused ? styles.windowLayout : styles.windowLayout_disabled} ref={elementRef} onPointerDown={onFocusChange}>
            <div className={isFocused ? styles.windowPointerLayout : styles.windowPointerLayout_disabled}>
                <div className={styles.windowHeader} ref={headRef} onPointerDown={positionHandler.onPointerDown} onPointerMove={positionHandler.onPointerMove} onPointerUp={positionHandler.onPointerUp}>
                    <h2>{name}</h2>
                    <button tabIndex={0}
                            onClick={deleteWindow}
                            onPointerDown={(e) => e.stopPropagation()}>
                        <SvgClose width={10} height={10}/>
                    </button>
                </div>
                <div className={styles.windowBody}>
                    <div className={styles.windowBodyScroll}>
                        {children}
                    </div>
                    <div ref={bottomRef} className={styles.windowBottom} onPointerDown={resizeHandler.bottom.onPointerDown} onPointerMove={resizeHandler.bottom.onPointerMove} onPointerUp={resizeHandler.bottom.onPointerUp} />
                    <div ref={leftRef} className={styles.windowLeft} onPointerDown={resizeHandler.left.onPointerDown} onPointerMove={resizeHandler.left.onPointerMove} onPointerUp={resizeHandler.left.onPointerUp} />
                    <div ref={rightRef} className={styles.windowRight} onPointerDown={resizeHandler.right.onPointerDown} onPointerMove={resizeHandler.right.onPointerMove} onPointerUp={resizeHandler.right.onPointerUp} />
                    <div ref={leftBottomRef} className={styles.windowLeftBottom} onPointerDown={resizeHandler.leftBottom.onPointerDown} onPointerMove={resizeHandler.leftBottom.onPointerMove} onPointerUp={resizeHandler.leftBottom.onPointerUp} />
                    <div ref={rightBottomRef} className={styles.windowRightBottom} onPointerDown={resizeHandler.rightBottom.onPointerDown} onPointerMove={resizeHandler.rightBottom.onPointerMove} onPointerUp={resizeHandler.rightBottom.onPointerUp} />
                </div>
            </div>
        </div>
    )
}
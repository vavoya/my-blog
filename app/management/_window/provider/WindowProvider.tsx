'use client'

import {useEffect, useRef, useState} from "react";
import WindowLayout from "@/app/management/_window/provider/WindowLayout";
import frameScheduler from "@/app/management/_window/provider/WindowDrawManager";
import {WindowObj} from "@/app/management/_window/provider/types";
import {WindowCommands} from "@/app/management/_window/provider/utils/windowCommands";
import styles from "./windowProvider.module.scss"


type WindowProviderProps = {
    commands?: WindowCommands;
}
export default function WindowProvider({ commands }: WindowProviderProps) {
    // 이녀석은 z-index
    const [windowSet, setWindowSet] = useState<Set<WindowObj['id']>>(new Set([]));
    // 이녀석은 dom element 렌더링 순서. 거의 안변한다
    const [windowMap, setWindowMap] = useState<Map<WindowObj['id'], WindowObj>>(new Map());
    const windowSetRef = useRef<typeof windowSet>(windowSet);
    const windowMapRef = useRef<typeof windowMap>(windowMap);

    // windowRef 최신화
    windowSetRef.current = windowSet;
    windowMapRef.current = windowMap;

    useEffect(() => {
        if (!commands) return;

        const newWindowSet = new Set(windowSetRef.current);
        const newWindowMap = new Map(windowMapRef.current);

        if (commands.reset) {
            newWindowSet.clear();
        }

        if (commands.add) {
            commands.add.forEach(w => {
                if (newWindowSet.has(w.id)) {
                    // 이미 존재하는 윈도우
                    // z-index만 갱신
                    newWindowSet.delete(w.id);
                    newWindowSet.add(w.id);
                } else {
                    // 존재하지 않는 윈도우
                    newWindowMap.set(w.id, w);
                    newWindowSet.add(w.id);
                }
            })
        }

        if (commands.rename) {
            for (const id in commands.rename) {
                const w = newWindowMap.get(id)
                if (w) {
                    w.name = commands.rename[id];
                }
            }
        }

        if (commands.remove) {
            commands.remove.forEach(w => {
                newWindowMap.delete(w)
                newWindowSet.delete(w)
            })
        }

        if (commands.update) {
            commands.update.forEach(w => {
                if (newWindowSet.has(w.id)) {
                    // 이미 존재하는 윈도우
                    // z-index 갱신
                    newWindowSet.delete(w.id);
                    newWindowSet.add(w.id);

                    // 덮어쓰기
                    newWindowMap.set(w.id, w);
                } else {
                    // 존재하지 않는 윈도우
                    //newWindowMap.set(w.id, w);
                    //newWindowSet.add(w.id);
                }
            })
        }

        setWindowSet(newWindowSet);
        setWindowMap(newWindowMap);
    }, [commands]);

    useEffect(() => {
        frameScheduler.startFrameLoop();

        return () => {
            frameScheduler.endFrameLoop();
        }
    }, []);

    const zIndexMap = [...windowSet].reduce((acc, cur, zIndex) => {
        acc.set(cur, zIndex);
        return acc;
    }, new Map<WindowObj['id'], number>())

    return (
        <div className={styles.windowProvider}>
            {
                [...windowMap].map(([id, windowObj]) => {
                    const zIndex = zIndexMap.get(id)!;
                    const isFocused = zIndex === (windowSet.size - 1)

                    const onFocusChange = () => {
                        if (!isFocused) {
                            const newWindowSet = new Set(windowSet);
                            newWindowSet.delete(id);
                            newWindowSet.add(id);
                            setWindowSet(newWindowSet);
                        }
                    }

                    const deleteWindow = () => {
                        const newWindowSet = new Set(windowSet);
                        const newWindowMap = new Map(windowMap);
                        newWindowSet.delete(id);
                        newWindowMap.delete(id);
                        setWindowSet(newWindowSet);
                        setWindowMap(newWindowMap);
                    }

                    return (
                        <WindowLayout id={windowObj.id} key={windowObj.id} zIndex={zIndex} deleteWindow={deleteWindow} onFocusChange={onFocusChange} isFocused={isFocused} x={windowObj.x} y={windowObj.y} width={windowObj.width} height={windowObj.height} name={windowObj.name}>
                            {windowObj.node}
                        </WindowLayout>
                    )
                })
            }
        </div>
    )
}
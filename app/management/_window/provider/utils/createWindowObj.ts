import {WindowObj} from "@/app/management/_window/provider/types";
import {ReactNode} from "react";
import {MIN_HEIGHT, MIN_WIDTH} from "@/app/management/_window/provider/const";

/**
 * 명시된 스펙으로 윈도우 객체를 생성합니다.
 *
 * @param {string} id - 윈도우의 유일 식별자 (중복 시 에러 발생 가능)
 * @param {string} name - 윈도우에 나타날 이름 (중복 허용)
 * @param {ReactNode} node - 윈도우의 GUI 요소
 * @param {number} [x=0] - 윈도우의 X 좌표 (좌측 상단 기준)
 * @param {number} [y=0] - 윈도우의 Y 좌표 (좌측 상단 기준)
 * @param {number} [width=400] - 창의 너비. 최소 너비 이상이어야 한다.
 * @param {number} [height=300] - 창의 높이. 최소 높이 이상이어야 한다.
 * @return {WindowObj} 검증된 크기로 생성된 window 객체.
 */
export default function createWindowObj(id: string, name: string, node: ReactNode, x: number = 0, y: number = 0, width: number = 400, height: number = 300): WindowObj {
    return {
        id,
        x,
        y,
        width: Math.max(width, MIN_WIDTH),
        height: Math.max(height, MIN_HEIGHT),
        name,
        node,
    }
}
import {WindowObj} from "@/app/management/_window/provider/types";
import {ReactNode} from "react";
import {MIN_HEIGHT, MIN_WIDTH} from "@/app/management/_window/provider/const";


export default function createWindowObj(id: string, name: string, node: ReactNode, x = 0, y = 0, width = 400, height = 300): WindowObj {
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
import {ReactNode} from "react";

export type WindowObj = {
    id: string;
    name: string;
    node: ReactNode;
    x: number;
    y: number;
    width: number;
    height: number;
}
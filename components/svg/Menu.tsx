import {SVGProps} from "react";

/**
 * viewBox="0 0 28 21"
 */
export default function SvgMenu({
                                      width = "28",
                                      height = "28",
                                      strokeWidth = "2"
                                  }: SVGProps<SVGSVGElement>) {
    return (
        <svg width={width} height={height} viewBox="0 0 28 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line y1="1.5" x2="28" y2="1.5" stroke="rgb(var(--primary-color))" strokeWidth={strokeWidth}/>
            <line y1="10.5" x2="28" y2="10.5" stroke="rgb(var(--primary-color))" strokeWidth={strokeWidth}/>
            <line y1="19.5" x2="28" y2="19.5" stroke="rgb(var(--primary-color))" strokeWidth={strokeWidth}/>
        </svg>
    );
}
import {SVGProps} from "react";

/**
 * viewBox="0 0 16 12"
 */
export default function SvgCheck({
                                      width = "16",
                                      height = "12",
                                      strokeWidth = "2"
                                  }: SVGProps<SVGSVGElement>) {
    return (
        <svg width={width}
             height={height}
             viewBox="0 0 16 12"
             preserveAspectRatio="xMidYMid meet"
             fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5L6 10L14.5 1.5" stroke="rgb(var(--primary-color))" strokeWidth={strokeWidth}/>
        </svg>
    );
}

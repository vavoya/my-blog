import {SVGProps} from "react";

/**
 * viewBox="0 0 15 3"
 */
export default function SvgSubtract({
                                   width = "15",
                                   height = "3",
                                   strokeWidth = "2"
                               }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 15 3"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M0 1.5H15" stroke="rgb(var(--primary-color))" strokeWidth={strokeWidth}/>
        </svg>
    );
}


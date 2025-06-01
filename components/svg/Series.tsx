import {SVGProps} from "react";

/**
 * viewBox="0 0 28 22"
 */
export default function SvgSeries({
                                      width = "28",
                                      height = "22",
                                      strokeWidth = "3"
                                  }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width={width}  // 사용자가 전달한 width 사용
            height={height} // 사용자가 전달한 height 사용
            viewBox="0 0 28 22"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M2 19.5601V5.69141H22.3077V19.5601H2Z"
                stroke="rgb(var(--primary-color))"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"/>
            <path
                d="M4.76904 2H25.9998V16.3077"
                stroke="rgb(var(--primary-color))"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"/>
        </svg>
    );
}

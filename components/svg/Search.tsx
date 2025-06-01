import {SVGProps} from "react";

/**
 * viewBox="0 0 28 28"
 */
export default function SvgSearch({
                                      width = "28",
                                      height = "28"
                                  }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width={width}  // 사용자가 전달한 width 사용
            height={height} // 사용자가 전달한 height 사용
            viewBox="0 0 28 28"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M17.1577 17.1582L25.9998 26.0003"
                stroke="rgb(var(--primary-color))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"/>
            <circle
                cx="10.8421"
                cy="10.8421"
                r="8.8421"
                stroke="rgb(var(--primary-color))"
                strokeWidth="3"/>
        </svg>
    );
}

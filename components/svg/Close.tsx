import {SVGProps} from "react";

/**
 * viewBox="0 0 14 14"
 */
export default function SvgClose({
                                     width = "14",
                                     height = "14"
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width={width}  // 사용자가 전달한 width 사용
            height={height} // 사용자가 전달한 height 사용
            viewBox="0 0 14 14"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1 1C10.6 10.6 9 9 7 7M7 7L13 1M7 7L1 13M7 7L13 13"
                stroke="rgb(var(--primary-color))"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );

}
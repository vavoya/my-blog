import {SVGProps} from "react";

/**
 * viewBox="0 0 16 18"
 */
export default function SvgPrev({
                                    width = "16",
                                    height = "18"
                                }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width={width}  // 사용자가 전달한 width 사용
            height={height} // 사용자가 전달한 height 사용
            viewBox="0 0 16 18"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7 1L15 9L7 17"
                stroke="rgb(var(--primary-color))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"/>
            <path
                d="M1 1L9 9L1 17"
                stroke="rgb(var(--primary-color))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"/>
        </svg>
    );

}

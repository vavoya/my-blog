import {SVGProps} from "react";

/**
 * viewBox="0 0 17 18"
 */
export default function SvgNext({
                                    width = "17",
                                    height = "18"
                                }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width={width}  // 사용자가 전달한 width 사용
            height={height} // 사용자가 전달한 height 사용
            viewBox="0 0 17 18"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15.5 17L7.5 9L15.5 1"
                stroke="rgb(var(--primary-color))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"/>
            <path
                d="M9.5 17L1.5 9L9.5 1"
                stroke="rgb(var(--primary-color))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"/>
        </svg>
    );
}

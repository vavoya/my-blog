import {SVGProps} from "react";

/**
 * viewBox="0 0 28 27"
 */
export default function SvgTag({
                                   width = "28",
                                   height = "27",
                                   strokeWidth = "3"
                               }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width={width}  // 사용자가 전달한 width 사용
            height={height} // 사용자가 전달한 height 사용
            viewBox="0 0 28 27"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12.5882 2L10.8235 9.05882M6.94118 24.5882L8.70588 17.5294M8.70588 17.5294H2H23.8824H8.70588ZM8.70588 17.5294L10.8235 9.05882M10.8235 9.05882H4.11765H18.9412H26M21.0588 2L15.4118 24.5882"
                stroke="rgb(var(--primary-color))"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"/>
        </svg>
    );
}

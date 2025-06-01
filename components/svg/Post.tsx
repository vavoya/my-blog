import {SVGProps} from "react";

/**
 * viewBox="0 0 22 26"
 */
export default function SvgPost({
                                      width = "22",
                                      height = "26",
                                      strokeWidth="3"
                                  }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 22 26"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M2 24V2H20V24H2Z" stroke="rgb(var(--primary-color))" strokeWidth={strokeWidth} strokeLinejoin="round"/>
            <path d="M6 7H11" stroke="rgb(var(--primary-color))" strokeWidth={strokeWidth} strokeLinecap="round"/>
            <path d="M6 13H16" stroke="rgb(var(--primary-color))" strokeWidth={strokeWidth} strokeLinecap="round"/>
            <path d="M6 19H14" stroke="rgb(var(--primary-color))" strokeWidth={strokeWidth} strokeLinecap="round"/>
        </svg>

    );
}

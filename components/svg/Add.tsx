import {SVGProps} from "react";

/**
 * viewBox="0 0 46 46"
 */
export default function SvgAdd({
                                      width = "46",
                                      height = "46",
                                      strokeWidth = "2"
                                  }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 46 46"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M22.5577 0V23M22.5577 46V23M22.5577 23H0H46" stroke="rgb(var(--primary-color))" strokeWidth={strokeWidth}/>
        </svg>
    );
}
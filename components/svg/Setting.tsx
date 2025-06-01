import {SVGProps} from "react";

/**
 * viewBox="0 0 46 46"
 */
export default function SvgSetting({
                                      width = "28",
                                      height = "28",
                                      strokeWidth = "2"
                                  }: SVGProps<SVGSVGElement>) {
    return (
        <svg width={width}
             height={height}
             viewBox="0 0 24 24"
             preserveAspectRatio="xMidYMid meet"
             fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" stroke="rgb(var(--primary-color))" strokeWidth={strokeWidth}/>
            <circle cx="11.9998" cy="9.00078" r="3.2" stroke="rgb(var(--primary-color))" strokeWidth={strokeWidth}/>
            <path d="M3 19.1992C3 19.1992 8.29516 16.1992 12 16.1992C15.7048 16.1992 21 19.1992 21 19.1992" stroke="rgb(var(--primary-color))" strokeWidth={strokeWidth}/>
        </svg>
    );
}
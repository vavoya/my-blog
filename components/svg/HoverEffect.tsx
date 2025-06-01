import {SVGProps} from "react";

/**
 * viewBox="0 0 1 1"
 */
export default function HoverEffect({
                                        width = "1",
                                        height = "1",
                                        opacity = "0.1"
                                    }: SVGProps<SVGSVGElement>) {

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 1 1"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg">
            <path
                opacity={opacity}
                d="M0.5 0H1L0.5 1H0L0.5 0Z"
                fill="rgb(var(--primary-color))"/>
        </svg>
    )
}



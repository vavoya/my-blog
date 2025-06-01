import {SVGProps} from "react";

/**
 * viewBox="0 0 16 16"
 */
export default function LoadingSpinner({
                                      width = "16",
                                      height = "16",
                                  }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C12.0803 0 15.4471 3.05471 15.9384 7.00199C16.0066 7.55004 15.5523 8 15 8C14.4477 8 14.0088 7.54933 13.9249 7.00345C13.4687 4.03503 10.9897 2 8 2C4.68629 2 2 4.68629 2 8C2 10.9897 4.03503 13.4687 7.00346 13.9249C7.54933 14.0088 8 14.4477 8 15C8 15.5523 7.55004 16.0066 7.00199 15.9384C3.05471 15.4471 0 12.0803 0 8C0 3.58172 3.58172 0 8 0Z" fill="rgb(var(--primary-color))"/>
        </svg>
    );
}

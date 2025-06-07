'use client'

import Link, {LinkProps} from "next/link";
import {AnchorHTMLAttributes, RefObject, useEffect, useRef, useState} from "react";
import {usePathname} from "next/navigation";
import {createPortal} from "react-dom";
import ProcessingOverlay from "@/components/processingOverlay/ProcessingOverlay";


type Props = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
    ref?: RefObject<any>
}
export default function ProcessingOverlayLink({onClick, ...rest}: Props) {
    const [ isRouting, setIsRouting ] = useState(false);
    const pathname = usePathname();
    const PROCESSING_TEXT = "페이지 이동 중입니다"
    const [ processingText, setProcessingText] = useState<string>(PROCESSING_TEXT)
    const precessingLevel = useRef(0);

    useEffect(() => {
        setIsRouting(false);
        setProcessingText(PROCESSING_TEXT);
        precessingLevel.current = 0;
    }, [pathname])

    useEffect(() => {
        if (!isRouting) return;

        const id = setInterval(() => {
            const level = precessingLevel.current

            if (level === 0) {
                setProcessingText(PROCESSING_TEXT + ".")
                precessingLevel.current = 1;
            } else if (level === 1) {
                setProcessingText(PROCESSING_TEXT + "..")
                precessingLevel.current = 2;
            } else if (level === 2) {
                setProcessingText(PROCESSING_TEXT + "...")
                precessingLevel.current = 3;
            } else if (level === 3) {
                setProcessingText(PROCESSING_TEXT)
                precessingLevel.current = 0;
            }

        }, 1000);

        return () => clearInterval(id);
    }, [isRouting])

    return (
        <>
            <Link {...rest}
                  onClick={(event) => {
                      if (onClick) {
                          onClick(event)
                      }
                      setIsRouting(true)
                  }}/>
            {
                isRouting && createPortal(
                    <ProcessingOverlay text={processingText} onClick={() => null} />,
                    document.body
                )
            }
        </>
    )

}
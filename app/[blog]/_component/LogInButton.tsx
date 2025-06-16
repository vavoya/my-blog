'use client'

import {usePathname} from "next/navigation";
import ProcessingOverlayLink from "@/components/ProcessingOverlayLink";

export default function LogInButton() {
    const pathname = usePathname()
    return (
        <ProcessingOverlayLink href={`/login?redirectTo=${pathname}`}>
            로그인
        </ProcessingOverlayLink>
    )
}
'use client'

import Link from "next/link";
import {usePathname} from "next/navigation";

export default function LogInButton() {
    const pathname = usePathname()
    return (
        <Link href={`/login?from=${pathname}`}>
            로그인
        </Link>
    )
}
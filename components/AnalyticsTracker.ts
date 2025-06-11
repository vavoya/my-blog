'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageview } from '@/lib/gtag'

export function AnalyticsTracker() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        const url = searchParams.toString()
            ? `${pathname}?${searchParams.toString()}`
            : pathname
        pageview(url)
    }, [pathname, searchParams])

    return null
}

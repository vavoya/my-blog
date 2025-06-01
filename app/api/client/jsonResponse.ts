// /app/api/client/sendJsonResponse.ts (또는 types 위치)

import { NextResponse } from 'next/server'
import { Response } from "@/app/api/types";

export function jsonResponse<T>(res: Response<T>, isCached: boolean = false) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json; charset=utf-8'
    };

    if (isCached) {
        headers['Cache-Control'] = 'max-age=240, s-maxage=120, stale-while-revalidate=30';
    } else {
        headers['Cache-Control'] = 'no-store';
    }

    return NextResponse.json(res, {
        status: res.status,
        headers
    });
}


// /app/api/client/sendJsonResponse.ts (또는 types 위치)

import { NextResponse } from 'next/server'
import { Response } from "@/app/api/types";

/**
 * 클라이언트의 응답을 기본 캐시를 포함하여 처리하는 함수
 * @param res - API 응답 객체
 * @param isCached - 캐시 여부 (기본값: false)
 */
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


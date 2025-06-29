// /app/api/server/sendJsonResponse.ts (또는 types 위치)

import { NextResponse } from 'next/server'
import {Response} from "@/app/api/types";
/**
 * 서버의 응답을 기본 캐시를 포함하여 처리하는 함수
 * @param res - API 응답 객체
 * @param isCached - 캐시 여부 (기본값: false)
 */
export function jsonResponse<T>(res: Response<T>) {
    return NextResponse.json(res, {
        status: res.status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
}

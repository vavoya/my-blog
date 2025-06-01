// /app/api/server/sendJsonResponse.ts (또는 types 위치)

import { NextResponse } from 'next/server'
import {Response} from "@/app/api/types";

export function jsonResponse<T>(res: Response<T>) {
    return NextResponse.json(res, {
        status: res.status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
}

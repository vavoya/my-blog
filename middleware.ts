import {NextRequest, NextResponse} from "next/server";
import {logRequestWithContext} from "@/lib/logger";

const allowedOrigins = [
    process.env.NEXT_PUBLIC_BASE_URL
]

const corsOptions = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-DeleteByUserIdType, Authorization',
}

export function middleware(request: NextRequest) {
    const corsResponse = processCorsPreflight(request);
    if (corsResponse) {
        return corsResponse;
    }

    const internalApiResponse = processInternalApi(request);
    if (internalApiResponse) {
        return internalApiResponse;
    }


    return processCorsHeaders(request);
}








function processCorsPreflight(request: NextRequest) {
    // Check the origin from the request
    const origin = request.headers.get('origin') ?? ''
    const isAllowedOrigin = allowedOrigins.includes(origin)

    // Handle preflighted requests
    const isPreflight = request.method === 'OPTIONS'

    if (isPreflight) {
        const preflightHeaders = {
            ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
            ...corsOptions,
        }

        return new Response(null, { status: 204, headers: preflightHeaders });
    } else {
        return null;
    }
}

function processInternalApi(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 내부 API 호출 검증
    const isInternalApi = pathname.startsWith('/api/server')
    const isServerFetch = request.headers.get('x-internal-secret') === process.env.INTERNAL_API_SECRET
    if (isInternalApi && !isServerFetch) {
        logRequestWithContext(request, pathname, '접근이 허용되지 않은 내부 API입니다.');
        return new Response("접근이 허용되지 않은 내부 API입니다.", { status: 403 })
    } else if (isInternalApi && isServerFetch) {
        // 내부 api로 전달
        return NextResponse.next()
    } else {
        return null;
    }
}

function processCorsHeaders(request: NextRequest) {
    const origin = request.headers.get('origin') ?? ''
    const isAllowedOrigin = allowedOrigins.includes(origin)

    // Handle simple requests
    const response = NextResponse.next()// 계속 진행

    if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin)
    }

    Object.entries(corsOptions).forEach(([key, value]) => {
        response.headers.set(key, value)
    })

    return response;
}
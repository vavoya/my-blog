import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {logRequestWithContext} from "@/lib/logger";

const allowedOrigins = [
    'https://www.sim-log.com',
    'https://my-blog-ten-coral-80.vercel.app',
    'https://my-blog-git-dev-010-vavoyas-projects.vercel.app',
    'http://localhost:3000']

const corsOptions = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-DeleteByUserIdType, Authorization',
}

export default auth((request) => {
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
    }

    const url = request.nextUrl
    const { pathname } = url;

    // 내부 API 호출 검증
    const isInternalApi = pathname.startsWith('/api/server')
    const isServerFetch = request.headers.get('x-internal-secret') === process.env.INTERNAL_API_SECRET
    if (isInternalApi && !isServerFetch) {
        logRequestWithContext(request, pathname, '접근이 허용되지 않은 내부 API입니다.');
        return new Response("접근이 허용되지 않은 내부 API입니다.", { status: 403 })
    }



    // 리디렉션 파트
    const session = request.auth

    const isManagement = pathname.startsWith("/management")
    const isRegister = pathname === "/register"
    const isLogin = pathname.startsWith("/loginByAuthId")

    const needAuth = !session
    const needRegistration = !(session?.registrationState)

    // 관리 페이지: 인증 필요
    if (isManagement && needAuth) {
        const loginUrl = new URL("/login", url.origin)
        loginUrl.searchParams.set("redirectTo", url.pathname)
        return NextResponse.redirect(loginUrl)
    }

    // 등록 페이지: 등록 안 된 사용자만 접근 가능
    if (isRegister && !(!needAuth && needRegistration)) {
        const redirectTo = url.searchParams.get("redirectTo")
        return NextResponse.redirect(new URL(redirectTo || "/", url.origin))
    }

    // 로그인 페이지
    if (isLogin && !needAuth && !needRegistration) {
        return NextResponse.redirect(new URL("/", url.origin)) // 이미 완료된 사용자
    }
    /*
    if (isLogin) {
        if (needAuth) {
            // 로그인 페이지 접근 허용
        } else if (needRegistration) {
            const registrationUrl = new URL("/register", url.origin)
            const redirectTo = url.searchParams.get("redirectTo")
            if (redirectTo) registrationUrl.searchParams.set("redirectTo", redirectTo)
            return NextResponse.redirect(registrationUrl)
        } else {
            return NextResponse.redirect(new URL("/", url.origin)) // 이미 완료된 사용자
        }
    }

     */


    // Handle simple requests
    const response = NextResponse.next()// 계속 진행

    if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin)
    }

    Object.entries(corsOptions).forEach(([key, value]) => {
        response.headers.set(key, value)
    })
});

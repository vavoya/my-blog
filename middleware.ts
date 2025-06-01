import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
    const url = request.nextUrl
    const { pathname } = url;
    const session = request.auth

    const isManagement = pathname.startsWith("/management")
    const isRegister = pathname.startsWith("/register")
    const isLogin = pathname.startsWith("/login")

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

    return NextResponse.next(); // 계속 진행
});

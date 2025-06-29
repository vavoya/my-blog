import {auth} from "@/auth";
import {redirect} from "next/navigation";

// 무조건 서버 컴포넌트에서 호출
export async function redirects(pathname: string, redirectTo: string) {
    const origin = process.env.NEXT_PUBLIC_BASE_URL

    // 절대 경로 또는 origin이 다른 경우에는 루트로 보내기
    try {
        if ((new URL(redirectTo)).origin !== origin) {
            return redirect(encodeURI('/'))
        }
    } catch {

    }

    const isManagement = pathname.startsWith("/management")
    const isRegister = pathname === "/register"
    const isLogin = pathname.startsWith("/login")

    if (!isManagement && !isRegister && !isLogin) {
        // 리다이렉트 대상이 아니니 pass
        return null
    }

    const session = await auth()
    const needAuth = !session
    const needRegistration = !(session?.registrationState)

    // 관리 페이지: 인증 필요
    if (isManagement && needAuth) {
        return redirect(encodeURI(`/login?redirectTo=${pathname}`));
    }

    // 등록 페이지: 등록 안 된 사용자만 접근 가능
    if (isRegister && !(!needAuth && needRegistration)) {

        return redirect(encodeURI(redirectTo || '/'));
    }

    // 로그인 페이지
    if (isLogin && !needAuth && !needRegistration) {
        return redirect(encodeURI(redirectTo || '/')); // 이미 완료된 사용자
    }

    return null;
}
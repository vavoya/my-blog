import {jsonResponse} from "@/app/api/client/jsonResponse";
import {response} from "@/app/api/_utils/createResponse";
import {NextAuthRequest} from "next-auth";

// 401
export const checkAuth = async (req: NextAuthRequest) => {
    const session = req.auth;

    // 세션이 없거나
    // 유저 정보가 없거나
    // 등록 상태가 없거나
    // 로그인으로 인정하지 않는
    // 경우
    if (!session || !session.userId || !session?.registrationState || !session.isLogin) {
        return jsonResponse(response.unauthorized('인증 오류1: 인증 정보가 없습니다.'));
    }

    return session.userId
}
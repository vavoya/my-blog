import {auth} from "@/auth";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import {response} from "@/app/api/_utils/createResponse";

// 401
export const checkAuth = async () => {
    const session = await auth()

    if (!session) {
        return jsonResponse(response.unauthorized('인증 오류1: 인증 정보가 없습니다.'));
    }

    if (!session.userId) {
        return jsonResponse(response.unauthorized('인증 오류2: 인증 정보가 없습니다.'));
    }

    return session.userId
}
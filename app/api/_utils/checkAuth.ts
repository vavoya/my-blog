import {jsonResponse} from "@/app/api/client/jsonResponse";
import {response} from "@/app/api/_utils/createResponse";
import {NextAuthRequest} from "next-auth";

/**
 * 요청의 인증 상태를 비동기적으로 검사합니다.
 *
 * 이 함수는 주어진 요청 객체에 첨부된 세션을 확인하여 인증 여부를 검증합니다.
 * 세션 데이터의 존재 여부, 유효한 사용자 ID, 가입 상태, 로그인 인지 여부 등을 점검합니다.
 *
 * 이 조건들 중 하나라도 충족되지 않으면, 인증 오류를 나타내는 401 응답(JSON 객체)을 반환합니다.
 * 모든 조건이 충족되면 세션에서 사용자 ID를 추출하여 반환합니다.
 *
 * @param req - 인증 세션 데이터를 포함한 요청 객체 (`NextAuthRequest`)
 * @returns 인증에 성공하면 사용자 ID(string)를, 실패하면 인증 오류 응답 객체(JSON)를 포함하는 Promise
 */
export const checkAuth = async (req: NextAuthRequest) => {
    const session = req.auth;

    if (!session || !session.userId || !session?.registrationState || !session.isLogin) {
        return jsonResponse(response.unauthorized('인증 오류1: 인증 정보가 없습니다.'));
    }

    return session.userId
}
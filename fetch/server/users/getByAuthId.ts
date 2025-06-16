import {response} from "@/app/api/_utils/createResponse";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {UserIdDocumentByAuthId} from "@/data-access/user-info/types";
import {Response} from "@/app/api/types";
import {createUserQuery} from "@/app/api/server/users/createQuery";

/*
* authId를 이용하여 유저 정보를 가져온다.
* 근데 이제 로그인 시에만 호출하는 걸로 해야한다. 로그인 로그를 DB에 기록함(시점)
 *
 * @param [authId] 유저의 [authId]
 * @returns 유저 정보
 * @throws {Error} 서버와 통신할 수 없을 때
 * @throws {Error} 예상치 못한 오류가 발생했을 때
 *
 */
export default async function getByAuthId(authId: UserInfoResponse['auth_id']) {
    const apiUrl = createUserQuery(null, authId);


    try {
        const result = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                "x-internal-secret": process.env.INTERNAL_API_SECRET!,
            },
            cache: "force-cache",
            next: { tags: ['all', authId, `${authId}-user`] }
        });
        const data: Response<UserIdDocumentByAuthId> = await result.json();
        return data;
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        const message = isNetworkError
            ? '통신 실패: 서버에 연결할 수 없습니다.'
            : '예상치 못한 오류가 발생했습니다.';
        return response.timeout(message);
    }
}

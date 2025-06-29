import {UserInfoDocument, UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {ClientSession} from "mongodb";
import updateLastModified from "@/data-access/user-info/updateLastModified";
import getUserInfoByUserId from "@/data-access/user-info/getUserInfoByUserId";



type Return = {
    status: "success";
    lastModified: UserInfoDocument['last_modified'];
} | {
    status: "failure";
    error : {
        success: false;
        error: "LastModifiedMismatch";
        message: "블로그 정보가 최신 상태가 아닙니다.";
    } | {
        success: false;
        error : "UserNotFound";
        message: "유저 정보를 찾을 수 없습니다."
    }
}

/**
 * 주어진 userId와 최종 수정 버전으로 유효성 검사를 합니다.
 *
 * 다음 절차로 동작합니다:
 * 1. 트랜잭션 시작
 * 2. `lastModified` 버전 검증
 * 3. 포스트 찾고 삭제합니다
 * 4. 포스트가 series_id가 있으면 series_id에 포스트 삭제합니다
 * 5. [folderId] 찾고 count 업데이트합니다 (-1)
 * 6. 트랜잭션 커밋
 *
 * 중간에 실패 시 트랜잭션을 중단하고 에러 정보를 반환합니다.
 *
 * @param userId  사용자 ID
 * @param lastModified  lastModified 버전
 * @returns 업데이트 성공 여부 및 새로운 lastModified 값 또는 에러 정보
 */
export async function checkLastModified(userId: UserInfoDocument['_id'], lastModified:  UserInfoResponse['last_modified'], session: ClientSession): Promise<Return> {
    // 버전 체크
    const updatedUserInfo = await updateLastModified(userId, new Date(lastModified), session);
    /*
    유저 정보를 못찾거나
    유저 정보는 찾았는데 버전 정보가 매치가 안되거나
     */
    if (!updatedUserInfo) {
        const userInfo = await getUserInfoByUserId(userId);
        await session.abortTransaction();

        // 유저 정보를 찾았으면 버전 불일치
        if (userInfo) {
            return {
                status: "failure",
                error: {
                    success: false,
                    error: "LastModifiedMismatch",
                    message: "블로그 정보가 최신 상태가 아닙니다."
                }
            }
        } else {
            // 유저 정보 못찾음
            return {
                status: "failure",
                error: {
                    success: false,
                    error: "UserNotFound",
                    message: "유저 정보를 찾을 수 없습니다."
                }
            }
        }
    }

    return {
        status: "success",
        lastModified: updatedUserInfo.last_modified
    }
}
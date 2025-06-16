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
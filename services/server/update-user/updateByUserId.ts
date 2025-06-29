import {client} from "@/lib/mongoDB/mongoClient";
import {ObjectId} from "mongodb";
import updateUserInfo from "@/data-access/user-info/updateUserInfo";
import {UpdateInput} from "@/services/server/update-user/updateByUserId.type";
import {checkLastModified} from "@/services/server/checkLastModified";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";


export type UpdateByUserIdResult =
    | { success: true; data: {lastModified: UserInfoDocument['last_modified']}}
    | { success: false; error: "LastModifiedMismatch"; message: string }
    | { success: false; error: "UserNotFound"; message: string }
    | { success: false; error: "TransactionError"; message: string; stack?: string };
/**
 * 주어진 userId의 사용자 정보를 수정합니다..
 *
 * 다음 절차로 동작합니다:
 * 1. 트랜잭션 시작
 * 2. `lastModified` 버전 검증
 * 3. 유저 정보를 수정합니다
 * 4. 트랜잭션 커밋
 *
 * 중간에 실패 시 트랜잭션을 중단하고 에러 정보를 반환합니다.
 *
 * @param params 사용자 ID, 사용자 정보, lastModified 버전을 포함한 요청 데이터
 * @returns 업데이트 성공 여부 및 새로운 lastModified 값 또는 에러 정보
 */
export default async function updateByUserId(params: UpdateInput & { lastModified: string }): Promise<UpdateByUserIdResult> {
    const session = client.startSession()

    session.startTransaction();

    const userIdObjId = new ObjectId(params.userId)

    try {
        // 버전 체크
        const checkedResult = await checkLastModified(userIdObjId, params.lastModified, session);
        if (checkedResult.status === "failure") {
            return checkedResult.error
        }

        const newLastModified = checkedResult.lastModified;

        // 1. 회원 정보 수정으로 끝내
        const result = await updateUserInfo(
            userIdObjId,
            params.userName,
            params.blogName,
            params.agreementsEmail,
            session);
        if (!result) {
            await session.abortTransaction();
            return {
                success: false,
                error: "UserNotFound",
                message: "유저 정보를 찾지 못했습니다."
            }
        }

        await session.commitTransaction();
        return {
            success: true,
            data: {
                lastModified: newLastModified
            }
        }
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        let message = "알 수 없는 에러가 발생했습니다.";
        let stack = undefined;

        if (error instanceof Error) {
            message = error.message;
            stack = error.stack;
        } else if (typeof error === "string") {
            message = error;
        }

        console.error(
            "[MongoDB 트랜잭션 에러]",
            `userId: ${params.userId}`,
            `error: ${message}`,
            stack ? `stack: ${stack}` : ""
        );

        return {
            success: false,
            error: "TransactionError",
            message,
            stack
        };
    } finally {
        await session.endSession();
    }
}
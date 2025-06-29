import {client} from "@/lib/mongoDB/mongoClient";
import {ObjectId} from "mongodb";
import updateIsDeletedAndLastModified from "@/data-access/user-info/updateIsDeletedAndLastModified";
import {RemoveInput} from "@/services/server/remove-account/removeByUserId.type";


export type RemoveByUserIdResult =
    | { success: true;}
    | { success: false; error: "UserNotFound"; message: string }
    | { success: false; error: "TransactionError"; message: string; stack?: string };
/**
 * 주어진 정보로 사용자 정보를 제거합니다.
 *
 * 다음 절차로 동작합니다:
 * 1. 트랜잭션 시작
 * 2. `lastModified` 버전 검증
 * 6. 회원 정보를 탈퇴로 수정합니다.
 * 6. 트랜잭션 커밋
 *
 * 중간에 실패 시 트랜잭션을 중단하고 에러 정보를 반환합니다.
 *
 * @param params userId
 * @returns 업데이트 성공 여부 및 새로운 lastModified 값 또는 에러 정보
 */
export default async function removeByUserId(params: RemoveInput): Promise<RemoveByUserIdResult> {
    const session = client.startSession()

    session.startTransaction();

    try {
        // 1. 회원 정보 수정으로 끝내
        const result = await updateIsDeletedAndLastModified(new ObjectId(params.userId), session);
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
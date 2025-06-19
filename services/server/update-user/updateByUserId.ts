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

        // 회원 정보 수정으로 끝내
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
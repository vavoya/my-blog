import {client} from "@/lib/mongoDB/mongoClient";
import {ObjectId} from "mongodb";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {parseBlocks, shikiPromise} from "md-ast-parser";
import {PatchInput} from "@/services/server/about/patchByUserId.type";
import findOneAboutInfoByUserId from "@/data-access/about-info/findOneAndUpdateAboutInfoByUserId";
import {checkLastModified} from "@/services/server/checkLastModified";


export type PatchByUserIdResult =
    | { success: true; data: {lastModified: UserInfoDocument['last_modified']}}
    | { success: false; error: "LastModifiedMismatch"; message: string }
    | { success: false; error: "UserNotFound"; message: string }
    | { success: false; error: "UpdateAboutError"; message: string }
    | { success: false; error: "TransactionError"; message: string; stack?: string };
export default async function patchByUserId({lastModified, ...post}: PatchInput & { lastModified: string }): Promise<PatchByUserIdResult> {
    const session = client.startSession()

    session.startTransaction();

    const userIdObjId = new ObjectId(post.userId)

    try {
        // 버전 체크
        const checkedResult = await checkLastModified(userIdObjId, lastModified, session);
        if (checkedResult.status === "failure") {
            return checkedResult.error
        }
        const newLastModified = checkedResult.lastModified;

        await shikiPromise;
        const newAbout = await findOneAboutInfoByUserId(userIdObjId, {
            content: post.content,
            ast: parseBlocks(post.content.split('\n'))
        }, session);
        if (!newAbout) {
            // 폴더 정보 못찾음
            await session.abortTransaction();
            return {
                success: false,
                error: "UpdateAboutError",
                message: "소개글 업데이트를 실패했습니다."
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
            `userId: ${post.userId}`,
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
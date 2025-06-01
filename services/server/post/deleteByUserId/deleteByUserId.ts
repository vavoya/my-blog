import {client} from "@/lib/mongoDB/mongoClient";
import {ObjectId} from "mongodb";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import findOneAndUpdatePostCount from "@/models/folder_info/findOneAndUpdatePostCount";
import deletePostByPostId from "@/models/post_info/deletePostByPostId";
import {Type} from "@/services/server/post/deleteByUserId/type";
import {checkLastModified} from "@/services/server/checkLastModified";

export type DeleteByUserIdResult =
    | { success: true; data: {lastModified: UserInfoDocument['last_modified']}}
    | { success: false; error: "LastModifiedMismatch"; message: string }
    | { success: false; error: "UserNotFound"; message: string }
    | { success: false; error: "FolderNotFound"; message: string }
    | { success: false; error: "DeleteFailed"; message: string }
    | { success: false; error: "TransactionError"; message: string; stack?: string };
export default async function deleteByUserId({lastModified, ...post}: Type & { lastModified: string }): Promise<DeleteByUserIdResult> {
    const session = client.startSession()

    session.startTransaction();

    const userIdObjId = new ObjectId(post.userId)

    try {
        // 버전 체크
        // 버전 체크
        const checkedResult = await checkLastModified(userIdObjId, lastModified, session);
        if (checkedResult.status === "failure") {
            return checkedResult.error
        }
        const newLastModified = checkedResult.lastModified;

        // 포스트 찾고 삭제
        const { acknowledged } = await deletePostByPostId(userIdObjId, new ObjectId(post.postId), session);
        if (!acknowledged) {
            // 포스트 정보 못찾음
            await session.abortTransaction();
            return {
                success: false,
                error: "DeleteFailed",
                message: "포스트 정보를 찾을 수 없습니다."
            }
        }


        // folderId 찾고 count 업데이트
        const updatedPrevFolderInfo = await findOneAndUpdatePostCount(userIdObjId, new ObjectId(post.folderId), -1);
        if (!updatedPrevFolderInfo) {
            // 폴더 정보 못찾음
            await session.abortTransaction();
            return {
                success: false,
                error: "FolderNotFound",
                message: "폴더 정보를 찾을 수 없습니다."
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
import {client} from "@/lib/mongoDB/mongoClient";
import {ObjectId} from "mongodb";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import findOneAndUpdatePostCount from "@/data-access/folder-info/findOneAndUpdatePostCount";
import deletePostByPostId from "@/data-access/post-info/deletePostByPostId";
import {DeleteByUserIdType} from "@/services/server/post/deleteByUserId.type";
import {checkLastModified} from "@/services/server/checkLastModified";
import removePosts from "@/data-access/series-info/removePosts";

export type DeleteByUserIdResult =
    | { success: true; data: {lastModified: UserInfoDocument['last_modified']}}
    | { success: false; error: "LastModifiedMismatch"; message: string }
    | { success: false; error: "UserNotFound"; message: string }
    | { success: false; error: "FolderNotFound"; message: string }
    | { success: false; error: "DeleteFailed"; message: string }
    | { success: false; error: "TransactionError"; message: string; stack?: string };
/**
 * 주어진 userId와 postId 해당하는 사용자의 포스트를 삭제합니다.
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
 * @param input 사용자 ID, 포스트 ID, lastModified 버전을 포함한 요청 데이터
 * @returns 업데이트 성공 여부 및 새로운 lastModified 값 또는 에러 정보
 */
export default async function deleteByUserId({lastModified, ...post}: DeleteByUserIdType & { lastModified: string }): Promise<DeleteByUserIdResult> {
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



        // 1. 포스트 찾고 삭제
        const deletedPost = await deletePostByPostId(userIdObjId, new ObjectId(post.postId), session);
        if (!deletedPost) {
            // 포스트 정보 못찾음
            await session.abortTransaction();
            return {
                success: false,
                error: "DeleteFailed",
                message: "포스트 정보를 찾을 수 없습니다."
            }
        }

        // 2. 포스트가 series_id가 있으면 series_id에 포스트 삭제
        if (deletedPost.series_id) {
            const { acknowledged } = await removePosts(userIdObjId, deletedPost.series_id, [deletedPost._id], session)
            if (!acknowledged) {
                // 시리즈 정보 갱신 실패
                await session.abortTransaction();
                return {
                    success: false,
                    error: "DeleteFailed",
                    message: "시리즈 정보 갱신에 실패했습니다."
                }
            }
        }


        // 3. [folderId] 찾고 count 업데이트
        const updatedPrevFolderInfo = await findOneAndUpdatePostCount(userIdObjId, new ObjectId(deletedPost.folder_id), -1);
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
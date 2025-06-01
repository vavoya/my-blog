import {client} from "@/lib/mongoDB/mongoClient";
import {ObjectId} from "mongodb";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import findOneAndUpdatePostCount from "@/models/folder_info/findOneAndUpdatePostCount";
import {Type} from "@/services/server/folder/deleteByUserId/type";
import deleteFolderByPostId from "@/models/folder_info/findOneAndDeleteFolderByFolderId";
import movePostsByFolderId from "@/models/post_info/movePostsByFolderId";
import updateManyByPFolderId from "@/models/folder_info/updateManyByPFolderId";
import {checkLastModified} from "@/services/server/checkLastModified";

export type DeleteByUserIdResult =
    | { success: true; data: {lastModified: UserInfoDocument['last_modified']}}
    | { success: false; error: "LastModifiedMismatch"; message: string }
    | { success: false; error: "UserNotFound"; message: string }
    | { success: false; error: "FolderNotFound"; message: string }
    | { success: false; error: "UpdateFolderFailed"; message: string }
    | { success: false; error: "DeleteFailed"; message: string }
    | { success: false; error: "UpdatePostFailed"; message: string }
    | { success: false; error: "TransactionError"; message: string; stack?: string };
export default async function deleteByUserId({lastModified, ...post}: Type & { lastModified: string }): Promise<DeleteByUserIdResult> {
    const session = client.startSession()

    session.startTransaction();

    const folderIdObjId = new ObjectId(post.folderId);
    const userIdObjId = new ObjectId(post.userId)

    try {
        // 버전 체크
        // 버전 체크
        const checkedResult = await checkLastModified(userIdObjId, lastModified, session);
        if (checkedResult.status === "failure") {
            return checkedResult.error
        }
        const newLastModified = checkedResult.lastModified;

        // 1. 폴더 찾고 삭제
        const deletedFolder = await deleteFolderByPostId(userIdObjId, folderIdObjId, session);
        if (!deletedFolder) {
            // 폴더 정보 못찾음
            await session.abortTransaction();
            return {
                success: false,
                error: "DeleteFailed",
                message: "폴더 삭제를 실패했습니다."
            }
        }
        const pFolderId = deletedFolder.pfolder_id
        if (!pFolderId) {
            // 폴더 정보 못찾음 -> 삭제 불가능한 폴더 (루트 폴더)
            await session.abortTransaction();
            return {
                success: false,
                error: "FolderNotFound",
                message: "상위 폴더 탐색에 실패했습니다."
            }
        }

        // 2. 상위 폴더에 count 갱신
        const { modifiedCount, acknowledged } = await movePostsByFolderId(userIdObjId, folderIdObjId, new ObjectId(pFolderId), session);
        if (!acknowledged) {
            // 포스트의 폴더 업데이트 실패
            await session.abortTransaction();
            return {
                success: false,
                error: "UpdatePostFailed",
                message: "포스트 정보 갱신에 실패했습니다."
            }
        }

        // 3. folderId 찾고 count 업데이트
        const updatedPFolder = await findOneAndUpdatePostCount(userIdObjId, folderIdObjId, modifiedCount);
        if (!updatedPFolder) {
            // 폴더 정보 못찾음
            await session.abortTransaction();
            return {
                success: false,
                error: "FolderNotFound",
                message: "폴더 정보를 찾을 수 없습니다."
            }
        }

        // 4. 하위 폴더들의 부모 폴더 id 갱신
        const updateResult = await updateManyByPFolderId(userIdObjId, folderIdObjId, {pfolder_id: pFolderId}, session)
        if (!updateResult.acknowledged) {
            // 폴더 정보 못찾음
            await session.abortTransaction();
            return {
                success: false,
                error: "UpdateFolderFailed",
                message: "폴더 업데이트에 실패했습니다.."
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
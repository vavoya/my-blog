import {client} from "@/lib/mongoDB/mongoClient";
import {ObjectId} from "mongodb";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {MoveInput} from "@/services/server/folder/moveByUserId.type";
import findOneAndUpdateByFolderId from "@/data-access/folder-info/findOneAndUpdateByFolderId";
import {checkLastModified} from "@/services/server/checkLastModified";
import findOneByFolderId from "@/data-access/folder-info/findOneByFolderId";

export type PostByUserIdResult =
    | { success: true; data: {lastModified: UserInfoDocument['last_modified']}}
    | { success: false; error: "LastModifiedMismatch"; message: string }
    | { success: false; error: "UserNotFound"; message: string }
    | { success: false; error: "pForderNotFound"; message: string }
    | { success: false; error: "UpdateFailed"; message: string }
    | { success: false; error: "TransactionError"; message: string; stack?: string };
/**
 * 주어진 userId와 folderId, pFolderId에 해당하는 사용자의 폴더를 이동합니다..
 *
 * 다음 절차로 동작합니다:
 * 1. 트랜잭션 시작
 * 2. `lastModified` 버전 검증
 * 3. 이동할 폴더를 찾습니다 (루트 폴더이면 실패)
 * 4. 이동할 폴더의 pfolder_id를 수정합니다.
 * 5. 트랜잭션 커밋
 *
 * 중간에 실패 시 트랜잭션을 중단하고 에러 정보를 반환합니다.
 *
 * @param input 사용자 ID, 폴더 ID, 이동 대상 폴더 ID, lastModified 버전을 포함한 요청 데이터
 * @returns 업데이트 성공 여부 및 새로운 lastModified 값 또는 에러 정보
 */
export default async function moveByUserId({
                                                 userId,
                                                 folderId,
                                                 pFolderId,
                                                 lastModified,
                                             }: MoveInput & { lastModified: string }): Promise<PostByUserIdResult> {
    const session = client.startSession()

    session.startTransaction();

    const userIdObjId = new ObjectId(userId)
    const pFolderIdObjId = new ObjectId(pFolderId)
    const folderIdObjId = new ObjectId(folderId)

    try {
        // 버전 체크 & postId 갱신
        // 버전 체크
        const checkedResult = await checkLastModified(userIdObjId, lastModified, session);
        if (checkedResult.status === "failure") {
            return checkedResult.error
        }
        const newLastModified = checkedResult.lastModified;

        // 1. 루트 폴더를 선택
        const pfolder = await findOneByFolderId(userIdObjId, pFolderIdObjId, session)
        if (!pfolder) {
            await session.abortTransaction();
            return {
                success: false,
                error: "pForderNotFound",
                message: "부모 폴더가 없습니다."
            }
        }

        // 2. 폴더 찾고 업데이트
        const result = await findOneAndUpdateByFolderId(userIdObjId, folderIdObjId, {pfolder_id: pFolderIdObjId}, session)
        if (!result) {
            await session.abortTransaction();
            return {
                success: false,
                error: "UpdateFailed",
                message: "폴더 갱신에 실패했습니다."
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
            `userId: ${userId}`,
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
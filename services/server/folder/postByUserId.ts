import {client} from "@/lib/mongoDB/mongoClient";
import {ObjectId} from "mongodb";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {FolderInfoDocument} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {PostInput} from "@/services/server/folder/postByUserId.type";
import {checkLastModified} from "@/services/server/checkLastModified";
import findOneByFolderId from "@/data-access/folder-info/findOneByFolderId";
import insertOne from "@/data-access/folder-info/insertOne";


export type Data = {folderId: FolderInfoDocument['_id'], lastModified: UserInfoDocument['last_modified']}
export type PostByUserIdResult =
    | { success: true; data: Data}
    | { success: false; error: "LastModifiedMismatch"; message: string }
    | { success: false; error: "UserNotFound"; message: string }
    | { success: false; error: "FolderNotFound"; message: string }
    | { success: false; error: "InsertFailed"; message: string }
    | { success: false; error: "TransactionError"; message: string; stack?: string };
/**
 * 주어진 userId와 pFolderId에 해당하는 사용자의 폴더를 생성합니다.
 *
 * 다음 절차로 동작합니다:
 * 1. 트랜잭션 시작
 * 2. `lastModified` 버전 검증
 * 3. 부모 폴더의 존재 여부를 확인합니다.
 * 4. 부모 폴더 하위에 새 폴더를 생성합니다.
 * 5. 트랜잭션 커밋
 *
 * 중간에 실패 시 트랜잭션을 중단하고 에러 정보를 반환합니다.
 *
 * @param input 사용자 ID, 부모 폴더 ID, 새 폴더 이름, lastModified 버전을 포함한 요청 데이터
 * @returns 업데이트 성공 여부 및 새로운 lastModified 값 또는 에러 정보
 */
export default async function postByUserId({
                                               userId,
                                               pFolderId,
                                               folderName,
                                               lastModified,
                                           }: PostInput & { lastModified: string }): Promise<PostByUserIdResult> {
    const session = client.startSession()

    session.startTransaction();

    const userIdObjId = new ObjectId(userId);

    try {
        // 버전 체크 & postId 갱신
        // 버전 체크
        const checkedResult = await checkLastModified(userIdObjId, lastModified, session);
        if (checkedResult.status === "failure") {
            return checkedResult.error
        }
        const newLastModified = checkedResult.lastModified;

        // 1. 부모 [folderId] 확인
        const pFolderInfo = await findOneByFolderId(new ObjectId(userId), new ObjectId(pFolderId), session);
        if (!pFolderInfo) {
            // 폴더 정보 못찾음
            await session.abortTransaction();
            return {
                success: false,
                error: "FolderNotFound",
                message: "폴더 정보를 찾을 수 없습니다."
            }
        }

        const newFolder: FolderInfoDocument = {
            _id: new ObjectId(),
            folder_name: folderName,
            pfolder_id: new ObjectId(pFolderId),
            post_count: 0,
            user_id: new ObjectId(userId),

        }
        // 2. 폴더 생성
        const result = await insertOne(newFolder, session);
        if (!result.acknowledged) {
            await session.abortTransaction();
            return {
                success: false,
                error: "InsertFailed",
                message: "폴더 생성에 실패했습니다."
            }
        }

        await session.commitTransaction();
        return {
            success: true,
            data: {
                folderId: result.insertedId,
                lastModified: newLastModified,
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
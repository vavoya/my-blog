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
import {client} from "@/lib/mongoDB/mongoClient";
import {ObjectId} from "mongodb";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import findOneAndUpdatePostCount from "@/models/folder_info/findOneAndUpdatePostCount";
import {parseBlocks, shikiPromise} from "md-ast-parser";
import getPostByPostId from "@/models/post_info/getPostByPostId";
import {PatchInput} from "@/services/server/post/patchByUserId/type";
import findOneAndUpdateByPostId from "@/models/post_info/findOneAndUpdateByPostId";
import {checkLastModified} from "@/services/server/checkLastModified";


export type PutByUserIdResult =
    | { success: true; data: {lastModified: UserInfoDocument['last_modified']}}
    | { success: false; error: "LastModifiedMismatch"; message: string }
    | { success: false; error: "UserNotFound"; message: string }
    | { success: false; error: "UpdatePostError"; message: string }
    | { success: false; error: "UpdateFolderError"; message: string }
    | { success: false; error: "PostNotFound"; message: string }
    | { success: false; error: "TransactionError"; message: string; stack?: string };
export default async function patchByUserId({lastModified, ...post}: PatchInput & { lastModified: string }): Promise<PutByUserIdResult> {
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

        const postIdObjId = new ObjectId(post._id)
        const oldPost = await getPostByPostId(userIdObjId, postIdObjId);
        if (!oldPost) {
            // 폴더 정보 못찾음
            await session.abortTransaction();
            return {
                success: false,
                error: "PostNotFound",
                message: "기존 포스트를 찾을 수 없습니다."
            }
        }

        const nextFolderIdObjId = new ObjectId(post.folderId);
        if (oldPost.folder_id !== nextFolderIdObjId) {
            const updatedPrevFolderInfo = await findOneAndUpdatePostCount(userIdObjId, oldPost.folder_id, -1, session);
            const updatedNextFolderInfo = await findOneAndUpdatePostCount(userIdObjId, nextFolderIdObjId, 1, session);
            if (!updatedPrevFolderInfo || !updatedNextFolderInfo) {
                // 폴더 정보 못찾음
                await session.abortTransaction();
                return {
                    success: false,
                    error: "UpdateFolderError",
                    message: "폴더 정보를 찾을 수 없습니다."
                }
            }
        }

        await shikiPromise;
        const updateFields = {
            folder_id: nextFolderIdObjId,
            post_ast: parseBlocks(post.postContent.split('\n')),
            post_content: post.postContent,
            post_description: post.postDescription,
            post_name: post.postName,
            post_updatedAt: new Date(),
            thumb_url: post.thumbUrl,
        };

        const result = await findOneAndUpdateByPostId(userIdObjId, postIdObjId, updateFields, session)
        if (!result) {
            await session.abortTransaction();
            return {
                success: false,
                error: "UpdatePostError",
                message: "포스트 갱신에 실패했습니다."
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
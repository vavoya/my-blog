import {client} from "@/lib/mongoDB/mongoClient";
import {PostInfoDocument} from "@/lib/mongoDB/types/documents/postInfo.type";
import {PostInput} from "@/services/server/post/postByUserId.type";
import {ObjectId} from "mongodb";
import updateNextPostIdAndLastModified from "@/data-access/user-info/updateNextPostIdAndLastModified";
import getUserInfoByUserId from "@/data-access/user-info/getUserInfoByUserId";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import findOneAndUpdatePostCount from "@/data-access/folder-info/findOneAndUpdatePostCount";
import {parseBlocks, shikiPromise} from "md-ast-parser";
import {slugify} from "@/utils/slugify";
import insertOne from "@/data-access/post-info/insertOne";


export type PostByUserIdResult =
    | { success: true; data: {lastModified: UserInfoDocument['last_modified']}}
    | { success: false; error: "LastModifiedMismatch"; message: string }
    | { success: false; error: "UserNotFound"; message: string }
    | { success: false; error: "FolderNotFound"; message: string }
    | { success: false; error: "InsertFailed"; message: string }
    | { success: false; error: "TransactionError"; message: string; stack?: string };
export default async function postByUserId({
                                               userId,
                                               postName,
                                               postContent,
                                               postDescription,
                                               thumbUrl,
                                               folderId,
                                               lastModified,
}: PostInput & { lastModified: string }): Promise<PostByUserIdResult> {
    const session = client.startSession()

    session.startTransaction();

    try {
        await shikiPromise;
        const newPostInfo: PostInfoDocument = {
            _id: new ObjectId(),
            user_id: new ObjectId(userId),
            post_name: postName,
            post_content: postContent,
            post_description: postDescription,
            post_createdAt: new Date(),
            post_updatedAt: new Date(),
            post_ast: parseBlocks(postContent.split('\n')),
            post_url: slugify(postName),
            folder_id: new ObjectId(folderId),
            thumb_url: thumbUrl,
            series_id: null,
            viewCount: 0,
            ad_review: {
                reviewed: false,
                suitable: false,
                reviewedAt: null,
                reviewedBy: ""
            }
        }

        //  버전 체크 & postId 갱신
        const updatedUserInfo = await updateNextPostIdAndLastModified(new ObjectId(userId), new Date(lastModified), session);
        /*
        유저 정보를 못찾거나
        유저 정보는 찾았는데 버전 정보가 매치가 안되거나
         */
        if (!updatedUserInfo) {
            const userInfo = await getUserInfoByUserId(new ObjectId(userId));
            await session.abortTransaction();

            // 1. 유저 정보를 찾았으면 버전 불일치
            if (userInfo) {
                return {
                    success: false,
                    error: "LastModifiedMismatch",
                    message: "블로그 정보가 최신 상태가 아닙니다."
                }
            } else {
                // 2. 유저 정보 못찾음
                return {
                    success: false,
                    error: "UserNotFound",
                    message: "유저 정보를 찾을 수 없습니다."
                }
            }
        }

        // 3. [folderId] 찾고 count 업데이트
        const updatedFolderInfo = await findOneAndUpdatePostCount(new ObjectId(userId), new ObjectId(folderId), 1);
        if (!updatedFolderInfo) {
            // 폴더 정보 못찾음
            await session.abortTransaction();
            return {
                success: false,
                error: "FolderNotFound",
                message: "폴더 정보를 찾을 수 없습니다."
            }
        }

        // postId를 slug 뒤에 붙이기
        newPostInfo.post_url += `-${updatedUserInfo.next_post_id - 1}`

        // 4. 새 포스트 생성
        const result = await insertOne(newPostInfo, session);
        if (!result.acknowledged) {
            await session.abortTransaction();
            return {
                success: false,
                error: "InsertFailed",
                message: "포스트 생성에 실패했습니다."
            }
        }

        await session.commitTransaction();
        return {
            success: true,
            data: {
                lastModified: updatedUserInfo.last_modified
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
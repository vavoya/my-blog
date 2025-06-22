import {client} from "@/lib/mongoDB/mongoClient";
import {ObjectId} from "mongodb";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {checkLastModified} from "@/services/server/checkLastModified";
import {PatchInput} from "@/services/server/series/patchByUserId.type";
import findOneAndUpdate from "@/data-access/series-info/findOneAndUpdate";
import updateManyByPostIds from "@/data-access/post-info/updateManyByPostIds";
import {getAddedAndRemovedObjectIds} from "@/utils/getAddedAndRemovedObjectIds";


export type PostByUserIdResult =
    | { success: true; data: {lastModified: UserInfoDocument['last_modified']}}
    | { success: false; error: "LastModifiedMismatch"; message: string }
    | { success: false; error: "UserNotFound"; message: string }
    | { success: false; error: "UpdateFailed"; message: string }
    | { success: false; error: "TransactionError"; message: string; stack?: string };
export default async function patchByUserId({
                                                userId,
                                                seriesId,
                                                seriesName,
                                                seriesDescription,
                                                newPostList,
                                                lastModified,
                                            }: PatchInput & { lastModified: string }): Promise<PostByUserIdResult> {
    const session = client.startSession()

    session.startTransaction();

    const userIdObjId = new ObjectId(userId)
    const seriesIdObjId = new ObjectId(seriesId)

    try {
        // 버전 체크 & postId 갱신
        // 버전 체크
        const checkedResult = await checkLastModified(userIdObjId, lastModified, session);
        if (checkedResult.status === "failure") {
            return checkedResult.error
        }
        const newLastModified = checkedResult.lastModified;

        // 1. 시리즈 findOneAndUpdate로 찾으면서 업데이트 하기
        const newPostListObjId = newPostList.map(postId => new ObjectId(postId))
        const seriesUpdateFields = {
            series_name: seriesName,
            series_description: seriesDescription,
            post_list: newPostListObjId,
            updatedAt: new Date(),
        }
        const prevSeries = await findOneAndUpdate(userIdObjId, seriesIdObjId, seriesUpdateFields, { session, returnDocument: 'before'})
        if (!prevSeries) {
            await session.abortTransaction();
            return {
                success: false,
                error: "UpdateFailed",
                message: "시리즈 갱신에 실패했습니다."
            }
        }

        // 2. 그리고 추가되는 녀석과 삭제 되는 녀석 분류해서 포스트 업데이트 하기
        const {add, remove} = getAddedAndRemovedObjectIds(prevSeries.post_list, newPostListObjId);

        const addResult = await updateManyByPostIds(userIdObjId, add, {series_id: seriesIdObjId}, session)
        const removeResult = await updateManyByPostIds(userIdObjId, remove, {series_id: null}, session)
        if (!addResult.acknowledged || !removeResult.acknowledged) {
            await session.abortTransaction();
            return {
                success: false,
                error: "UpdateFailed",
                message: "포스트 정보 갱신에 실패했습니다."
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
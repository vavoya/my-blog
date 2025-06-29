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
/**
 * 주어진 userId와 seriesId 해당하는 사용자의 포스트를 삭제합니다.
 *
 * 다음 절차로 동작합니다:
 * 1. 트랜잭션 시작
 * 2. `lastModified` 버전 검증
 * 3. 시리즈 정보를 업데이트 합니다
 * 4. 시리즈에서 삭제된 요소와 추가된 요소의 포스트들의 정보를 업데이트합니다.
 * 5. 트랜잭션 커밋
 *
 * 중간에 실패 시 트랜잭션을 중단하고 에러 정보를 반환합니다.
 *
 * @param input 사용자 ID, 시리즈 정보, lastModified 버전을 포함한 요청 데이터
 * @returns 업데이트 성공 여부 및 새로운 lastModified 값 또는 에러 정보
 */
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
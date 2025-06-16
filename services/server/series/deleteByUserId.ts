import {client} from "@/lib/mongoDB/mongoClient";
import {ObjectId} from "mongodb";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {DeleteByUserIdType} from "@/services/server/series/deleteByUserId.type";
import {checkLastModified} from "@/services/server/checkLastModified";
import deleteSeries from "@/data-access/series-info/deleteSeries";
import updateManyByPostIds from "@/data-access/post-info/updateManyByPostIds";

export type DeleteByUserIdResult =
    | { success: true; data: {lastModified: UserInfoDocument['last_modified']}}
    | { success: false; error: "LastModifiedMismatch"; message: string }
    | { success: false; error: "UserNotFound"; message: string }
    | { success: false; error: "DeleteFailed"; message: string }
    | { success: false; error: "UpdatePostFailed"; message: string }
    | { success: false; error: "TransactionError"; message: string; stack?: string };
export default async function deleteByUserId({lastModified, ...post}: DeleteByUserIdType & { lastModified: string }): Promise<DeleteByUserIdResult> {
    const session = client.startSession()

    session.startTransaction();

    const seriesIdObjId = new ObjectId(post.seriesId);
    const userIdObjId = new ObjectId(post.userId)

    try {
        // 버전 체크
        // 버전 체크
        const checkedResult = await checkLastModified(userIdObjId, lastModified, session);
        if (checkedResult.status === "failure") {
            return checkedResult.error
        }
        const newLastModified = checkedResult.lastModified;

        // 1. 시리즈 찾고 삭제
        const deletedSeries = await deleteSeries(userIdObjId, seriesIdObjId, session);
        if (!deletedSeries) {
            // 시리즈 정보 못찾음
            await session.abortTransaction();
            return {
                success: false,
                error: "DeleteFailed",
                message: "시리즈 삭제를 실패했습니다."
            }
        }

        // 시리즈가 포스트가 있으면  포스트들의 series_id를 null로 변경
        const { acknowledged } = await updateManyByPostIds(userIdObjId, deletedSeries.post_list, {series_id: null}, session)
        if (!acknowledged) {
            await session.abortTransaction();
            return {
                success: false,
                error: "UpdatePostFailed",
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
import {client} from "@/lib/mongoDB/mongoClient";
import {ObjectId} from "mongodb";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInput} from "@/services/server/series/postByUserId/type";
import {checkLastModified} from "@/services/server/checkLastModified";
import {SeriesInfoDocument} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import insertOne from "@/models/series_info/insertOne";


export type Data = {
    seriesId: SeriesInfoDocument['_id'],
    createdAt: SeriesInfoDocument['createdAt'],
    updatedAt: SeriesInfoDocument['updatedAt'],
    lastModified: UserInfoDocument['last_modified']}
export type PostByUserIdResult =
    | { success: true; data: Data}
    | { success: false; error: "LastModifiedMismatch"; message: string }
    | { success: false; error: "UserNotFound"; message: string }
    | { success: false; error: "InsertFailed"; message: string }
    | { success: false; error: "TransactionError"; message: string; stack?: string };
export default async function postByUserId({
                                               userId,
                                               seriesName,
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

        const newDate = new Date();

        const newSeries: SeriesInfoDocument = {
            _id: new ObjectId(),
            series_name: seriesName,
            series_description: "",
            post_list: [],
            createdAt: newDate,
            updatedAt: newDate,
            user_id: new ObjectId(userId),

        }
        // 2. 폴더 생성
        const result = await insertOne(newSeries, session);
        if (!result.acknowledged) {
            await session.abortTransaction();
            return {
                success: false,
                error: "InsertFailed",
                message: "시리즈 생성에 실패했습니다."
            }
        }

        await session.commitTransaction();
        return {
            success: true,
            data: {
                seriesId: result.insertedId,
                createdAt: newDate,
                updatedAt: newDate,
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
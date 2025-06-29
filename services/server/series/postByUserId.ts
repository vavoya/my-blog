import {client} from "@/lib/mongoDB/mongoClient";
import {ObjectId} from "mongodb";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInput} from "@/services/server/series/postByUserId.type";
import {checkLastModified} from "@/services/server/checkLastModified";
import {SeriesInfoDocument} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import insertOne from "@/data-access/series-info/insertOne";


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
/**
 * 주어진 userId 해당하는 사용자의 시리즈를 생성합니다.
 *
 * 다음 절차로 동작합니다:
 * 1. 트랜잭션 시작
 * 2. `lastModified` 버전 검증
 * 3. 시리즈를 생성합니다.
 * 4. 트랜잭션 커밋
 *
 * 중간에 실패 시 트랜잭션을 중단하고 에러 정보를 반환합니다.
 *
 * @param input 사용자 ID, 시리즈 이름, lastModified 버전을 포함한 요청 데이터
 * @returns 업데이트 성공 여부 및 새로운 lastModified 값, 시리즈 ID, 수정 생성 일자 또는 에러 정보
 */
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
        // 1. 시리즈 생성
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
import {client} from "@/lib/mongoDB/mongoClient";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {COLLECTION_ABOUT, DB} from "@/lib/mongoDB/const";
import {AboutInfoDocument} from "@/lib/mongoDB/types/documents/aboutInfo.type";
import {ClientSession} from "mongodb";

/**
 * 주어진 userId에 해당하는 소개글 문서를 찾아 주어진 필드로 갱신합니다.
 *
 * MongoDB 트랜잭션 session이 선택적으로 사용되며,
 * `findOneAndUpdate`를 통해 갱신된 문서 이전 상태를 반환합니다.
 *
 * @param userId 업데이트할 사용자 ID
 * @param updateFields 적용할 업데이트 필드 (소개글 일부 또는 전체)
 * @param session 선택적 MongoDB ClientSession (트랜잭션용)
 * @returns MongoDB findOneAndUpdate 결과 객체 (이전 문서 포함)
 */
export default async function findOneAboutInfoByUserId(userId: UserInfoDocument['_id'], updateFields: Partial<AboutInfoDocument>,session?: ClientSession) {
    return await client.db(DB).collection<AboutInfoDocument>(COLLECTION_ABOUT).findOneAndUpdate(
        {
            user_id: userId,
        },
        {
            $set: updateFields,
        },
        {
            session
        });
}

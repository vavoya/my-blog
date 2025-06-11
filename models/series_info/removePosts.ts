import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_SERIES, DB} from "@/lib/mongoDB/const";
import {ClientSession} from "mongodb";
import {SeriesInfoDocument} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";


// 포스트 삭제에서 호출?
export default async function removePosts(userId: UserInfoDocument['_id'], seriesId: SeriesInfoDocument['_id'], posts: SeriesInfoDocument['post_list'], session?: ClientSession) {
    return await client.db(DB).collection<SeriesInfoDocument>(COLLECTION_SERIES).updateOne(
        {
            user_id: userId,
            _id: seriesId
        },
        {
            $pull: { tags: { $in: posts } }
        },
        {
            session,
        }
    )
}

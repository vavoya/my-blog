import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_SERIES, DB} from "@/lib/mongoDB/const";
import {ClientSession} from "mongodb";
import {SeriesInfoDocument} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";


export default async function deleteSeries(userId: UserInfoDocument['_id'], seriesId: SeriesInfoDocument['_id'], session?: ClientSession) {
    return await client.db(DB).collection<SeriesInfoDocument>(COLLECTION_SERIES).findOneAndDelete(
        {
            user_id: userId,
            _id: seriesId
        },
        {
            session,
        }
    )
}

import {client} from "@/lib/mongoDB/mongoClient";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {SeriesInfoDocument} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import {COLLECTION_SERIES, DB} from "@/lib/mongoDB/const";


export default async function getSeriesInfoByUserId(user_id: UserInfoDocument['_id']): Promise<SeriesInfoDocument[]> {
    const coll = client.db(DB).collection<SeriesInfoDocument>(COLLECTION_SERIES);
    const filter = { user_id };
    return await coll.find(filter).toArray();
}

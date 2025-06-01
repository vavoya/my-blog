import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_SERIES, DB} from "@/lib/mongoDB/const";
import {ClientSession} from "mongodb";
import {SeriesInfoDocument} from "@/lib/mongoDB/types/documents/seriesInfo.type";


export default async function insertOne(document: SeriesInfoDocument, session?: ClientSession) {
    return await client.db(DB).collection<SeriesInfoDocument>(COLLECTION_SERIES).insertOne(
        document,
        {
            session,
            forceServerObjectId: true,
        }
    )
}

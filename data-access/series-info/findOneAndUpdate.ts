import {ClientSession, ReturnDocument} from "mongodb";
import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_SERIES, DB} from "@/lib/mongoDB/const";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {SeriesInfoDocument} from "@/lib/mongoDB/types/documents/seriesInfo.type";

export default async function findOneAndUpdate(
    userId: UserInfoDocument['_id'],
    seriesId: SeriesInfoDocument['_id'],
    updateFields: Partial<SeriesInfoDocument>,
    option: {
        returnDocument?: ReturnDocument;
        session?: ClientSession;
    }) {
    return await client.db(DB).collection<SeriesInfoDocument>(COLLECTION_SERIES).findOneAndUpdate(
        {
            _id: seriesId,
            user_id: userId,
        },
        {
            $set: updateFields,
        },
        { returnDocument: option.returnDocument, session: option.session }
    );
}
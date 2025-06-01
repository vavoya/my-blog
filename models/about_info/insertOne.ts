import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_ABOUT, DB} from "@/lib/mongoDB/const";
import {AboutInfoDocument} from "@/lib/mongoDB/types/documents/aboutInfo.type";
import {ClientSession} from "mongodb";


export default async function insertOne(document: AboutInfoDocument, session?: ClientSession) {
    return await client.db(DB).collection<AboutInfoDocument>(COLLECTION_ABOUT).insertOne(
        document,
        {
            session,
            forceServerObjectId: true,
        }
    )
}

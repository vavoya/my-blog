import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_USER, DB} from "@/lib/mongoDB/const";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {ClientSession} from "mongodb";


export default async function insertOne(document: UserInfoDocument, session?: ClientSession) {
    return await client.db(DB).collection<UserInfoDocument>(COLLECTION_USER).insertOne(
        document,
        {
            session,
            forceServerObjectId: true,
        }
    )
}
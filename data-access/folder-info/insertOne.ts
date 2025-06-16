import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_FOLDER, DB} from "@/lib/mongoDB/const";
import {ClientSession} from "mongodb";
import {FolderInfoDocument} from "@/lib/mongoDB/types/documents/folderInfo.type";


export default async function insertOne(document: FolderInfoDocument, session?: ClientSession) {
    return await client.db(DB).collection<FolderInfoDocument>(COLLECTION_FOLDER).insertOne(
        document,
        {
            session,
            forceServerObjectId: true,
        }
    )
}

import {client} from "@/lib/mongoDB/mongoClient";
import {PostInfoDocument} from "@/lib/mongoDB/types/documents/postInfo.type";
import {COLLECTION_POST, DB} from "@/lib/mongoDB/const";
import {ClientSession} from "mongodb";


export default async function insertOne(newPostInfo: PostInfoDocument, session?: ClientSession) {
    return client.db(DB).collection<PostInfoDocument>(COLLECTION_POST).insertOne(
        newPostInfo,
        {session: session, forceServerObjectId: true}
    );
}
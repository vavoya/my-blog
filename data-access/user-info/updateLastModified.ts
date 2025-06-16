import {ClientSession} from "mongodb";
import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_USER, DB} from "@/lib/mongoDB/const";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";

export default async function updateLastModified(userId: UserInfoDocument['_id'], lastModified: UserInfoDocument['last_modified'], session?: ClientSession) {
    return await client.db(DB).collection<UserInfoDocument>(COLLECTION_USER).findOneAndUpdate(
        {
            _id: userId,
            last_modified: lastModified,
        },
        {
            $set: {
                last_modified: new Date()
            }
        },
        { returnDocument: 'after', session: session }
    );
}
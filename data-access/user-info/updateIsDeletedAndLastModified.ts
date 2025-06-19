import {ClientSession} from "mongodb";
import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_USER, DB} from "@/lib/mongoDB/const";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";

export default async function updateIsDeletedAndLastModified(userId: UserInfoDocument['_id'], session?: ClientSession) {
    return await client.db(DB).collection<UserInfoDocument>(COLLECTION_USER).findOneAndUpdate(
        {
            _id: userId,
        },
        {
            $set: {
                is_deleted: true,
                last_modified: new Date(),
                auth_id: ''
            }
        },
        { returnDocument: 'after', session: session }
    );
}
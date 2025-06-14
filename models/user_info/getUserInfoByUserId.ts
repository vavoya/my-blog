import {client} from "@/lib/mongoDB/mongoClient";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {COLLECTION_USER, DB} from "@/lib/mongoDB/const";


export default async function getUserInfoByUserId(user_id: UserInfoDocument['_id']): Promise<UserInfoDocument | null> {
    const coll = client.db(DB).collection<UserInfoDocument>(COLLECTION_USER);
    const filter = { _id: user_id, is_deleted: false };
    return await coll.findOne(filter);
}
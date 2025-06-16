import {client} from "@/lib/mongoDB/mongoClient";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {COLLECTION_USER, DB} from "@/lib/mongoDB/const";


export default async function getUserInfoByUserId(userId: UserInfoDocument['_id']): Promise<UserInfoDocument | null> {
    const coll = client.db(DB).collection<UserInfoDocument>(COLLECTION_USER);
    const filter = {
        _id: userId,
        is_deleted: false,
    };
    return await coll.findOne(filter);
}
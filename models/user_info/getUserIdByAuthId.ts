import {client} from "@/lib/mongoDB/mongoClient";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {UserIdDocumentByAuthId} from "@/models/user_info/types";
import {COLLECTION_USER, DB} from "@/lib/mongoDB/const";


export default async function getUserIdByAuthId(auth_id: UserInfoDocument['auth_id']): Promise<UserIdDocumentByAuthId | null> {
    const coll = client.db(DB).collection<UserInfoDocument>(COLLECTION_USER);
    const filter = { auth_id, is_deleted: false };
    const projection = {
        '_id': 1,
        'registration_state': 1,
    };
    return await coll.findOne<UserIdDocumentByAuthId>(filter, { projection });
}

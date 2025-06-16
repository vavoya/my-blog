import { client } from "@/lib/mongoDB/mongoClient";
import {COLLECTION_BANNED_AUTH_LIST, DB} from "@/lib/mongoDB/const";
import {BannedAuthListDocument} from "@/lib/mongoDB/types/documents/bannedList.type";

export default async function getBannedAuthDocument(authId: string) {
    const coll = client.db(DB).collection<BannedAuthListDocument>(COLLECTION_BANNED_AUTH_LIST);

    return await coll.findOne(
        { auth_id: authId },
    );
}

import {client} from "@/lib/mongoDB/mongoClient";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {COLLECTION_ABOUT, DB} from "@/lib/mongoDB/const";
import {AboutInfoDocument} from "@/lib/mongoDB/types/documents/aboutInfo.type";
import {ClientSession} from "mongodb";


export default async function findOneAboutInfoByUserId(userId: UserInfoDocument['_id'], session?: ClientSession) {
    const coll = client.db(DB).collection<AboutInfoDocument>(COLLECTION_ABOUT);
    const filter = {
        user_id: userId,
    };
    return await coll.findOne(filter, {session});
}

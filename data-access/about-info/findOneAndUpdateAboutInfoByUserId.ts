import {client} from "@/lib/mongoDB/mongoClient";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {COLLECTION_ABOUT, DB} from "@/lib/mongoDB/const";
import {AboutInfoDocument} from "@/lib/mongoDB/types/documents/aboutInfo.type";
import {ClientSession} from "mongodb";


export default async function findOneAboutInfoByUserId(userId: UserInfoDocument['_id'], updateFields: Partial<AboutInfoDocument>,session?: ClientSession) {
    return await client.db(DB).collection<AboutInfoDocument>(COLLECTION_ABOUT).findOneAndUpdate(
        {
            user_id: userId,
        },
        {
            $set: updateFields,
        },
        {
            session
        });
}

import {ClientSession} from "mongodb";
import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_USER, DB} from "@/lib/mongoDB/const";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";

export default async function updateUserInfo(
    userId: UserInfoDocument['_id'],
    userName: UserInfoDocument['user_name'],
    blogName: UserInfoDocument['blog_name'],
    agreementsEmail: UserInfoDocument['agreements']['email'],
    session?: ClientSession) {
    return await client.db(DB).collection<UserInfoDocument>(COLLECTION_USER).findOneAndUpdate(
        {
            _id: userId,
        },
        {
            $set: {
                user_name: userName,
                blog_name: blogName,
                'agreements.email': agreementsEmail,
            }
        },
        { returnDocument: 'after', session: session }
    );
}
import {ClientSession} from "mongodb";
import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_POST, DB} from "@/lib/mongoDB/const";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoDocument} from "@/lib/mongoDB/types/documents/postInfo.type";

export default async function updateManyByPostIds(userId: UserInfoDocument['_id'], postIds: PostInfoDocument['_id'][], updateFields: Partial<PostInfoDocument>, session?: ClientSession) {
    return await client.db(DB).collection<PostInfoDocument>(COLLECTION_POST).updateMany(
        {
            _id: { $in: postIds },
            user_id: userId },

        {
            $set: updateFields,
        },
        { session: session }
    );
}
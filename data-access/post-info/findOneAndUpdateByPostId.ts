import {ClientSession} from "mongodb";
import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_POST, DB} from "@/lib/mongoDB/const";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoDocument} from "@/lib/mongoDB/types/documents/postInfo.type";

export default async function findOneAndUpdateByPostId(userId: UserInfoDocument['_id'], postId: PostInfoDocument['_id'], updateFields: Partial<PostInfoDocument>, session?: ClientSession) {
    return await client.db(DB).collection<PostInfoDocument>(COLLECTION_POST).findOneAndUpdate(
        {
            _id: postId,
            user_id: userId,
        },
        {
            $set: updateFields,
        },
        { returnDocument: 'after', session: session }
    );
}
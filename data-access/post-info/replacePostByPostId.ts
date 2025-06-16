import {client} from "@/lib/mongoDB/mongoClient";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoDocument} from "@/lib/mongoDB/types/documents/postInfo.type";
import {COLLECTION_POST, DB} from "@/lib/mongoDB/const";
import {ClientSession} from "mongodb";


export default async function replacePostByPostId(userId: UserInfoDocument['_id'], postId: PostInfoDocument['_id'], postDocument: PostInfoDocument, session?: ClientSession) {
    const coll = client.db(DB).collection<PostInfoDocument>(COLLECTION_POST);
    return await coll.replaceOne(
        {
            user_id: userId,
            _id: postId,
        },
        postDocument,
        {
            session: session
        });
}
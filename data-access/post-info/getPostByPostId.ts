import {client} from "@/lib/mongoDB/mongoClient";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoDocument} from "@/lib/mongoDB/types/documents/postInfo.type";
import {COLLECTION_POST, DB} from "@/lib/mongoDB/const";


export default async function getPostByPostId(userId: UserInfoDocument['_id'], postId: PostInfoDocument['_id']): Promise<PostInfoDocument | null> {
    const coll = client.db(DB).collection<PostInfoDocument>(COLLECTION_POST);

    const filter = {
        user_id: userId,
        _id: postId,
    };

    return coll.findOne(filter);
}
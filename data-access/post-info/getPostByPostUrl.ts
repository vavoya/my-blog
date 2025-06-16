import {client} from "@/lib/mongoDB/mongoClient";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoDocument} from "@/lib/mongoDB/types/documents/postInfo.type";
import {COLLECTION_POST, DB} from "@/lib/mongoDB/const";


export default async function getPostByPostUrl(userId: UserInfoDocument['_id'], postUrl: PostInfoDocument['post_url']): Promise<PostInfoDocument | null> {
    const coll = client.db(DB).collection<PostInfoDocument>(COLLECTION_POST);

    const filter = {
        user_id: userId,
        post_url: postUrl,
    };

    return coll.findOne(filter);
}
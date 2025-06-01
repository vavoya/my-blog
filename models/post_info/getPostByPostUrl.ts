import {client} from "@/lib/mongoDB/mongoClient";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoDocument} from "@/lib/mongoDB/types/documents/postInfo.type";
import {COLLECTION_POST, DB} from "@/lib/mongoDB/const";


export default async function getPostByPostUrl(user_id: UserInfoDocument['_id'], post_url: PostInfoDocument['post_url']): Promise<PostInfoDocument | null> {
    const coll = client.db(DB).collection<PostInfoDocument>(COLLECTION_POST);

    const filter = {
        'user_id': user_id,
        'post_url': post_url,
    };

    return coll.findOne(filter);
}
import {client} from "@/lib/mongoDB/mongoClient";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoDocument} from "@/lib/mongoDB/types/documents/postInfo.type";
import {PaginatedPostsDocument} from "@/data-access/post-info/types";
import {COLLECTION_POST, DB} from "@/lib/mongoDB/const";


export default async function getPostsByPostIds(userId: UserInfoDocument['_id'], postIds: PostInfoDocument['_id'][]): Promise<PaginatedPostsDocument[]> {
    const coll = client.db(DB).collection<PostInfoDocument>(COLLECTION_POST);

    const filter = {
        user_id: userId,
        _id: {
            $in: postIds
        }
    };
    const projection = {
        post_url: 1,
        post_description: 1,
        post_name: 1,
        post_createdAt: 1,
        post_updatedAt: 1,
        thumb_url: 1,
        folder_id: 1,
        series_id: 1,
    };

    return coll.find<PaginatedPostsDocument>(filter, { projection }).toArray();
}


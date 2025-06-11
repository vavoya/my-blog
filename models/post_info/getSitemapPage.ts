import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_POST, DB} from "@/lib/mongoDB/const";
import {LIMIT} from "@/const/sitemap";
import {PostInfoDocument} from "@/lib/mongoDB/types/documents/postInfo.type";
import {SitemapPage} from "@/models/post_info/types";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";

export default async function getSitemapPage(userId: UserInfoDocument['_id'], page: number) {
    const coll = client.db(DB).collection<PostInfoDocument>(COLLECTION_POST);

    const filter = {
        user_id: userId
    };
    const projection = {
        post_url: 1,
        post_updatedAt: 1,
    };
    const sort = {
        post_updatedAt: -1 as const,
    }

    const skip = LIMIT * (page - 1);
    const limit = LIMIT;


    return coll.find<SitemapPage>(filter, { projection, sort, skip, limit }).toArray();
}
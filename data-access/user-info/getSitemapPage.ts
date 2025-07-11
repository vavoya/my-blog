import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_USER, DB} from "@/lib/mongoDB/const";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {SitemapPage} from "@/data-access/user-info/type";
import {LIMIT} from "@/const/sitemap";

export default async function getSitemapPage(pageNumber: number) {
    const coll = client.db(DB).collection<UserInfoDocument>(COLLECTION_USER);

    const filter = {
    };
    const projection = {
        user_name: 1,
        blog_url: 1,
        last_modified: 1,
    };

    const skip = LIMIT * (pageNumber - 1);
    const limit = LIMIT;


    return coll.find<SitemapPage>(filter, { projection, skip, limit }).toArray();
}
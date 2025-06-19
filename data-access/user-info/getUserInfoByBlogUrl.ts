import {client} from "@/lib/mongoDB/mongoClient";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {UserInfoDocumentByBlogUrl} from "@/data-access/user-info/types";
import {COLLECTION_USER, DB} from "@/lib/mongoDB/const";
import {ClientSession} from "mongodb";


export default async function getUserInfoByBlogUrl(blogUrl: UserInfoDocument['blog_url'], session?: ClientSession): Promise<UserInfoDocumentByBlogUrl | null> {
    const coll = client.db(DB).collection<UserInfoDocument>(COLLECTION_USER);
    const filter = {
        blog_url: blogUrl,
        is_deleted: false,
    };
    const projection = {
        'blog_name': 1,
        'blog_url': 1,
        'user_name': 1,
    };
    return await coll.findOne<UserInfoDocumentByBlogUrl>(filter, { projection, session});
}

import {client} from "@/lib/mongoDB/mongoClient";
import {FolderInfoDocument} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoDocument} from "@/lib/mongoDB/types/documents/postInfo.type";
import {LIMIT} from "@/const/page";
import {PaginatedPostsDocument} from "@/data-access/post-info/types";
import {COLLECTION_POST, DB} from "@/lib/mongoDB/const";


export default async function getPaginatedPostsByFolderId(
    userId: UserInfoDocument['_id'],
    folderId: FolderInfoDocument['_id'],
    pageNumber: number): Promise<PaginatedPostsDocument[]> {
    const coll = client.db(DB).collection<PostInfoDocument>(COLLECTION_POST);

    const filter = {
        user_id: userId,
        folder_id: folderId,
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
    const sort = {
        post_createdAt: -1 as const,
    };
    const skip = LIMIT * (pageNumber - 1);
    const limit = LIMIT;
    return coll.find<PaginatedPostsDocument>(filter, { projection, sort, skip, limit }).toArray();
}


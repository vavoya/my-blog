import {client} from "@/lib/mongoDB/mongoClient";
import {FolderInfoDocument} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoDocument} from "@/lib/mongoDB/types/documents/postInfo.type";
import {LIMIT} from "@/const/page";
import {PaginatedPostsDocument} from "@/models/post_info/types";
import {COLLECTION_POST, DB} from "@/lib/mongoDB/const";


export default async function getPaginatedPostsByFolderId(user_id: UserInfoDocument['_id'], folder_id: FolderInfoDocument['_id'], pagenum: number): Promise<PaginatedPostsDocument[]> {
    const coll = client.db(DB).collection<PostInfoDocument>(COLLECTION_POST);

    const filter = {
        'user_id': user_id,
        'folder_id': folder_id,
    };
    const projection = {
        'post_url': 1,
        'post_description': 1,
        'post_name': 1,
        'post_createdAt': 1,
        'post_updatedAt': 1,
        'thumb_url': 1,
        'folder_id': 1,
        'series_id': 1,
    };
    const sort = {
        'post_createdAt': -1 as const,
    };
    const skip = LIMIT * (pagenum - 1);
    const limit = LIMIT;
    return coll.find<PaginatedPostsDocument>(filter, { projection, sort, skip, limit }).toArray();
}


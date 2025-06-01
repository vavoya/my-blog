import {client} from "@/lib/mongoDB/mongoClient";
import {FolderInfoDocument} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {COLLECTION_FOLDER, DB} from "@/lib/mongoDB/const";


export default async function getFolderInfoByUserId(userId: UserInfoDocument['_id'], folderId: FolderInfoDocument['_id']): Promise<FolderInfoDocument[]> {
    const coll = client.db(DB).collection<FolderInfoDocument>(COLLECTION_FOLDER);
    const filter = {
        _id: folderId,
        user_id: userId,
    };
    return await coll.find(filter).toArray();
}

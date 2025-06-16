import {client} from "@/lib/mongoDB/mongoClient";
import {FolderInfoDocument} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {COLLECTION_FOLDER, DB} from "@/lib/mongoDB/const";


export default async function getFolderInfosByUserId(userId: UserInfoDocument['_id']): Promise<FolderInfoDocument[]> {
    const coll = client.db(DB).collection<FolderInfoDocument>(COLLECTION_FOLDER);
    const filter = {
        user_id: userId
    };
    return await coll.find(filter).toArray();
}

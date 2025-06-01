import {client} from "@/lib/mongoDB/mongoClient";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {COLLECTION_FOLDER, DB} from "@/lib/mongoDB/const";
import {ClientSession} from "mongodb";
import {FolderInfoDocument} from "@/lib/mongoDB/types/documents/folderInfo.type";


export default async function findOneAndDeleteFolderByFolderId(userId: UserInfoDocument['_id'], folderId: FolderInfoDocument['_id'], session?: ClientSession) {
    const coll = client.db(DB).collection<FolderInfoDocument>(COLLECTION_FOLDER);

    const filter = {
        'user_id': userId,
        '_id': folderId,
    };

    return coll.findOneAndDelete(filter, { session: session });
}
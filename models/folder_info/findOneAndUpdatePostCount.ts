import {ClientSession} from "mongodb";
import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_FOLDER, DB} from "@/lib/mongoDB/const";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {FolderInfoDocument} from "@/lib/mongoDB/types/documents/folderInfo.type";

export default async function findOneAndUpdatePostCount(userId: UserInfoDocument['_id'], folderId: FolderInfoDocument['_id'], num: number, session?: ClientSession) {
    return await client.db(DB).collection<FolderInfoDocument>(COLLECTION_FOLDER).findOneAndUpdate(
        {
            _id: folderId,
            user_id: userId,
        },
        {
            $inc: { post_count: num },
        },
        { returnDocument: 'after', session: session }
    );
}
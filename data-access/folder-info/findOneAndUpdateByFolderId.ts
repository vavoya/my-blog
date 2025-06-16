import {ClientSession} from "mongodb";
import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_FOLDER, DB} from "@/lib/mongoDB/const";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {FolderInfoDocument} from "@/lib/mongoDB/types/documents/folderInfo.type";

export default async function findOneAndUpdateByFolderId(userId: UserInfoDocument['_id'], folderId: FolderInfoDocument['_id'], updateFields: Partial<FolderInfoDocument>, session?: ClientSession) {
    return await client.db(DB).collection<FolderInfoDocument>(COLLECTION_FOLDER).findOneAndUpdate(
        {
            _id: folderId,
            user_id: userId,
        },
        {
            $set: updateFields,
        },
        { returnDocument: 'after', session: session }
    );
}
import {ClientSession} from "mongodb";
import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_FOLDER, DB} from "@/lib/mongoDB/const";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {FolderInfoDocument} from "@/lib/mongoDB/types/documents/folderInfo.type";

export default async function updateManyByPFolderId(userId: UserInfoDocument['_id'], pFolderId: FolderInfoDocument['_id'], updateFields: Partial<FolderInfoDocument>, session?: ClientSession) {
    return await client.db(DB).collection<FolderInfoDocument>(COLLECTION_FOLDER).updateMany(
        {
            user_id: userId,
            pfolder_id: pFolderId
        },
        {
            $set: updateFields,
        },
        { session: session }
    );
}
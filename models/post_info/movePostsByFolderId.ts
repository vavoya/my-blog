import {ClientSession} from "mongodb";
import {client} from "@/lib/mongoDB/mongoClient";
import {COLLECTION_USER, DB} from "@/lib/mongoDB/const";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoDocument} from "@/lib/mongoDB/types/documents/postInfo.type";
import {FolderInfoDocument} from "@/lib/mongoDB/types/documents/folderInfo.type";

export default async function movePostsByFolderId(userId: UserInfoDocument['_id'], prevFolderId: FolderInfoDocument['_id'], nextFolderId: FolderInfoDocument['_id'], session?: ClientSession) {
    return await client.db(DB).collection<PostInfoDocument>(COLLECTION_USER).updateMany(
        {
            _id: userId,
            folder_id: prevFolderId,
        },
        {
            $set: { folder_id: nextFolderId }
        },
        { session: session }
    );
}
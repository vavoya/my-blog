import {FolderInfoDocument} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {PostInfoDocument} from "@/lib/mongoDB/types/documents/postInfo.type";
import {client} from "@/lib/mongoDB/mongoClient";
import {PageNumberResult} from "@/models/pagination/pageNum/type";
import {LIMIT} from "@/const/page";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {COLLECTION_POST, DB} from "@/lib/mongoDB/const";


export default async function getByFolderId(user_id: UserInfoDocument['_id'], folder_id: FolderInfoDocument['_id'], post_id: PostInfoDocument['_id']): Promise<PageNumberResult | undefined> {

    const pipeLine = [
        {
            $match: {
                user_id,
                folder_id
            }
        },
        {
            $setWindowFields: {
                partitionBy: '$folder_id',
                sortBy: { post_createdAt: -1 },
                output: { rank: { $documentNumber: {} } }
            }
        },
        {
            $match: {
                _id: post_id
            }
        },
        {
            $project: {
                _id: 0,
                pageNumber: {
                    $ceil: { $divide: ['$rank', LIMIT] }
                }
            }
        }
    ]

    const result = await client.db(DB).collection<PostInfoDocument>(COLLECTION_POST).aggregate<PageNumberResult>(pipeLine, { maxTimeMS: 60000, allowDiskUse: true }).toArray()

    return result[0]
}
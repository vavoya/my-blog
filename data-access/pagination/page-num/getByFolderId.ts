import {FolderInfoDocument} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {PostInfoDocument} from "@/lib/mongoDB/types/documents/postInfo.type";
import {client} from "@/lib/mongoDB/mongoClient";
import {PageNumberResult} from "@/data-access/pagination/page-num/type";
import {LIMIT} from "@/const/page";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {COLLECTION_POST, DB} from "@/lib/mongoDB/const";


export default async function getByFolderId(
    userId: UserInfoDocument['_id'],
    folderId: FolderInfoDocument['_id'],
    postId: PostInfoDocument['_id']): Promise<PageNumberResult | undefined> {

    const pipeLine = [
        {
            $match: {
                user_id: userId,
                folder_id: folderId,
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
                _id: postId
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
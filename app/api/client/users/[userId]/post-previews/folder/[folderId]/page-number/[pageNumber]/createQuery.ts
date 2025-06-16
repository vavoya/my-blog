import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {createPostPreviewsQuery} from "@/app/api/client/users/[userId]/post-previews/createQuery";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";

function createPostPreviewsQueryByPageNumber(
    userId: UserInfoResponse['_id'],
    folderId: FolderInfoResponse['_id'],
    pageNumber: number,
) {
    return `${createPostPreviewsQuery(userId, [])}/folder/${folderId}/page-number/${pageNumber}` as const;
}

export {
    createPostPreviewsQueryByPageNumber
}

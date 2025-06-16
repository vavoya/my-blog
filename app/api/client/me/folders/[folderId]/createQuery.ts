import {createFolderQuery} from "@/app/api/client/me/folders/createQuery";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";


function createFolderIdQuery(folderId: FolderInfoResponse['_id']) {
    return `${createFolderQuery()}/${folderId}` as const
}

export {
    createFolderIdQuery
}
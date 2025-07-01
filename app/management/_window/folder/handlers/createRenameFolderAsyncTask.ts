import patchBySession from "@/fetch/client/folders/patchBySession";
import {buildTrie, FolderTrie} from "@/app/management/_utils/buildTrie";
import {AsyncTaskUnit, typedAsyncTaskUnit} from "@/lib/AsyncTaskManager";
import { UserInfoResponse } from "@/lib/mongoDB/types/documents/userInfo.type";
import { FolderInfoResponse } from "@/lib/mongoDB/types/documents/folderInfo.type";
import {FolderObj} from "@/components/modal/utils/toObj";


type Params = {
    userId: UserInfoResponse['_id'];
    folderId: FolderInfoResponse['_id'];
    folderName: FolderInfoResponse['folder_name'];
    newFolderName:FolderInfoResponse['folder_name']
    lastModified: UserInfoResponse['last_modified'];
};
type Store = {
    folderObj: FolderObj;
    setFolderObj: (newFolderObj: FolderObj) => void;
    setTrie: (newTrie: FolderTrie) => void;
}
type CreateRenameFolderAsyncTask = (params: Params, store: Store) => AsyncTaskUnit;
export const createRenameFolderAsyncTask: CreateRenameFolderAsyncTask = (params, store) => {
    return typedAsyncTaskUnit({
        name: "폴더 이름 변경",
        content: `기존[${params.folderName}] -> [${params.newFolderName}]`,
        time: new Date(),
        asyncTask: async (prevValue) => {
            // 1. fetch 요청 보내기
            const promise = patchBySession({
                userId: params.userId,
                folderId: params.folderId,
                folderName: params.newFolderName,
                lastModified: prevValue ?? params.lastModified,
            })

            // 4. fetch 응답 처리
            const result = await promise;

            if (result.status === 200) {
                return {
                    status: "success",
                    data: result.data,
                    nextValue: result.data.lastModified
                }
            } else {
                return {
                    status: "error",
                    data: result
                }
            }
        },
        errorCallback(err) {
            console.error(err);
            switch (err.status) {
                case 400:
                    break;
                case 401:
                    break;
                case 404:
                    break;
                case 408:
                    break
                case 409:
                    break;
                case 500:
                    break;
            }
            return err.message
        },
        successCallback() {
            const newFolderObj = {
                ...store.folderObj,
                [params.folderId]: {
                    ...store.folderObj[params.folderId],
                    folder_name: params.newFolderName,
                }
            }

            store.setFolderObj(newFolderObj)
            store.setTrie(buildTrie(newFolderObj))
        },
    })
}
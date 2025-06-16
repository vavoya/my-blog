import patchBySession from "@/fetch/client/folders/patchBySession";
import {buildTrie, FolderTrie} from "@/app/management/_utils/buildTrie";
import {AsyncTaskUnit, typedAsyncTaskUnit} from "@/utils/AsyncTaskManager";
import { UserInfoResponse } from "@/lib/mongoDB/types/documents/userInfo.type";
import { FolderInfoResponse } from "@/lib/mongoDB/types/documents/folderInfo.type";
import {FolderObj} from "@/components/modal/utils/toObj";


type Params = {
    userId: UserInfoResponse['_id'];
    folderId: FolderInfoResponse['_id'];
    pFolderId: FolderInfoResponse['_id'];
    folderName: FolderInfoResponse['folder_name'];
    lastModified: UserInfoResponse['last_modified'];
};
type Store = {
    folderObj: FolderObj;
    setFolderObj: (newFolderObj: FolderObj) => void;
    setTrie: (newTrie: FolderTrie) => void;
}
type CreateMoveFolderAsyncTask = (params: Params, store: Store) => AsyncTaskUnit;
export const createMoveFolderAsyncTask: CreateMoveFolderAsyncTask = (params, store) => {
    return typedAsyncTaskUnit({
        name: "폴더 이동",
        content: `이름[${params.folderName}]`,
        time: new Date(),
        asyncTask: async (prevValue) => {
            // 1. fetch 요청 보내기
            const promise = patchBySession({
                userId: params.userId,
                folderId: params.folderId,
                pFolderId: params.pFolderId,
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
                    pfolder_id: params.pFolderId,
                }
            }
            store.setFolderObj(newFolderObj)
            store.setTrie(buildTrie(newFolderObj))
        },
    })
}
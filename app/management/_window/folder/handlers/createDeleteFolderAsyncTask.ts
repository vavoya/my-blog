import deleteBySession from "@/fetch/client/folderInfo/deleteBySession";
import {buildTrie, FolderTrie} from "@/app/management/_utils/buildTrie";
import {AsyncTaskUnit, typedAsyncTaskUnit} from "@/utils/AsyncTaskManager";
import { UserInfoResponse } from "@/lib/mongoDB/types/documents/userInfo.type";
import { FolderInfoResponse } from "@/lib/mongoDB/types/documents/folderInfo.type";
import {FolderObj} from "@/components/modal/utils/toObj";
import {updatePaginatedPostsQuery} from "@/app/management/_queries/usePaginatedPostsQuery";

type Params = {
    userId: UserInfoResponse['_id'];
    folderId: FolderInfoResponse['_id'];
    folderName: FolderInfoResponse['folder_name'];
    lastModified: UserInfoResponse['last_modified'];
};
type Store = {
    folderObj: FolderObj;
    setFolderObj: (newFolderObj: FolderObj) => void;
    setTrie: (newTrie: FolderTrie) => void;
}
type CreateAddFolderAsyncTask = (params: Params, store: Store) => AsyncTaskUnit;
export const createDeleteFolderAsyncTask: CreateAddFolderAsyncTask = (params, store) => {

    return typedAsyncTaskUnit({
        name: "폴더 삭제",
        content: `이름[${params.folderName}]`,
        time: new Date(),
        asyncTask: async (prevValue) => {
            // 1. fetch 요청 보내기
            const promise = deleteBySession({
                userId: params.userId,
                folderId: params.folderId,
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
            // 해당 폴더 페이지네이션 삭제
            updatePaginatedPostsQuery(params.userId, params.folderId)
            // 부모 폴더 포스트 초기화 (포스트 이동)
            const pFolderId = store.folderObj[params.folderId].pfolder_id
            if (pFolderId) updatePaginatedPostsQuery(params.userId, pFolderId)

            // 폴더 트리 반영
            // 하위 폴더 pfolderId 업데이트
            const newFolderObj = { ...store.folderObj }
            for (const folderId in newFolderObj) {
                const folder = newFolderObj[folderId];
                if (folder.pfolder_id === params.folderId) {
                    folder.pfolder_id = newFolderObj[params.folderId].pfolder_id
                }
            }
            // 해당 폴더 삭제
            delete newFolderObj[params.folderId]

            store.setFolderObj(newFolderObj)
            store.setTrie(buildTrie(newFolderObj))
        },
    })
}
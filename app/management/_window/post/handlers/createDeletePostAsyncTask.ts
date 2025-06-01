import deleteBySession from "@/fetch/client/postInfo/deleteBySession";
import {AsyncTaskUnit, typedAsyncTaskUnit} from "@/utils/AsyncTaskManager";
import { UserInfoResponse } from "@/lib/mongoDB/types/documents/userInfo.type";
import {FolderObj} from "@/components/modal/utils/toObj";
import {updatePaginatedPostsQuery} from "@/app/management/_queries/usePaginatedPostsQuery";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";

type Params = {
    userId: PostInfoResponse['user_id'];
    postId: PostInfoResponse['_id'];
    name: PostInfoResponse['post_name'];
    folderId: PostInfoResponse['folder_id'];
    lastModified: UserInfoResponse['last_modified'];
};
type Store = {
    folderObj: FolderObj;
    setFolderObj: (newFolderObj: FolderObj) => void;
}
type CreateAddPostAsyncTask = (params: Params, store: Store) => AsyncTaskUnit;
export const createDeletePostAsyncTask: CreateAddPostAsyncTask = (params, store) => {

    return typedAsyncTaskUnit({
        name: "포스트 삭제",
        content: `제목[${params.name}]`,
        time: new Date(),
        asyncTask: async (prevValue) => {
            // 1. fetch 요청 보내기
            const promise = deleteBySession({
                lastModified: prevValue ?? params.lastModified,
                userId: params.userId,
                postId: params.postId,
                folderId: params.folderId,
            })

            // 4. fetch 응답 처리
            const result = await promise;

            if (result.status === 200) {
                return {
                    status: "success",
                    data: result,
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
            const initFolderId = params.folderId

            // 2. 관련 폴더 페이지 네이션 초기화
            updatePaginatedPostsQuery(initFolderId)

            store.setFolderObj({
                ...store.folderObj,
                [initFolderId]: {
                    ...store.folderObj[initFolderId],
                    post_count: store.folderObj[initFolderId].post_count - 1,
                }
            })
        },
    })
}
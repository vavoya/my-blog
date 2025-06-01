import postBySession from "@/fetch/client/postInfo/postBySession";
import {AsyncTaskUnit, typedAsyncTaskUnit} from "@/utils/AsyncTaskManager";
import { UserInfoResponse } from "@/lib/mongoDB/types/documents/userInfo.type";
import {FolderObj} from "@/components/modal/utils/toObj";
import {updatePaginatedPostsQuery} from "@/app/management/_queries/usePaginatedPostsQuery";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";

type Params = {
    userId: UserInfoResponse['_id'];
    folderId: PostInfoResponse['folder_id'];
    name: PostInfoResponse['post_name'];
    content: PostInfoResponse['post_content'];
    thumbnail: PostInfoResponse['thumb_url'];
    description: PostInfoResponse['post_description'];
    lastModified: UserInfoResponse['last_modified'];
};
type Store = {
    folderObj: FolderObj;
    setFolderObj: (newFolderObj: FolderObj) => void;
}
type CreateAddPostAsyncTask = (params: Params, store: Store) => AsyncTaskUnit;
export const createAddPostAsyncTask: CreateAddPostAsyncTask = (params, store) => {

    return typedAsyncTaskUnit({
        name: "새 포스트 추가",
        content: `제목[${params.name}]`,
        time: new Date(),
        asyncTask: async (prevValue) => {
            // 1. fetch 요청 보내기
            const promise = postBySession({
                lastModified: prevValue ?? params.lastModified,
                postName: params.name,
                postContent: params.content,
                postDescription: params.description,
                thumbUrl: params.thumbnail,
                folderId: params.folderId,
                userId: params.userId
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
            // 2. 관련 폴더 페이지 네이션 초기화
            updatePaginatedPostsQuery(params.userId, params.folderId)
            store.setFolderObj({
                ...store.folderObj,
                [params.folderId]: {
                    ...store.folderObj[params.folderId],
                    post_count: store.folderObj[params.folderId].post_count + 1,
                }
            })
        },
    })
}
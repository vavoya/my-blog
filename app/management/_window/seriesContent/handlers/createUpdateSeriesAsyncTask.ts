import patchBySession from "@/fetch/client/seriesInfo/patchBySession";
import {AsyncTaskUnit, typedAsyncTaskUnit} from "@/utils/AsyncTaskManager";
import { UserInfoResponse } from "@/lib/mongoDB/types/documents/userInfo.type";
import {SeriesObj} from "@/components/modal/utils/toObj";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import {QueryClient} from "@tanstack/query-core";
import {invalidatePaginatedPostsQuery} from "@/components/modal/_queries/usePaginatedPostsQuery";


type Params = {
    userId: UserInfoResponse['_id'];
    seriesId: SeriesInfoResponse['_id'];
    seriesName: SeriesInfoResponse['series_name'];
    seriesDescription: SeriesInfoResponse['series_description']
    postList: SeriesInfoResponse['post_list'];
    lastModified: UserInfoResponse['last_modified'];
    queryClient: QueryClient;
};
type Store = {
    seriesObj: SeriesObj;
    setSeriesObj: (newSeriesObj: SeriesObj) => void;
}
type CreateRenameFolderAsyncTask = (params: Params, store: Store) => AsyncTaskUnit;
export const createUpdateSeriesAsyncTask: CreateRenameFolderAsyncTask = (params, store) => {
    return typedAsyncTaskUnit({
        name: "시리즈 수정",
        content: `이름[${params.seriesName}]`,
        time: new Date(),
        asyncTask: async (prevValue) => {
            // 1. fetch 요청 보내기
            const promise = patchBySession({
                userId: params.userId,
                seriesId: params.seriesId,
                seriesName: params.seriesName,
                seriesDescription: params.seriesDescription,
                newPostList: params.postList,
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
            const seriesId = params.seriesId;
            const newSeriesObj: SeriesObj = {
                ...store.seriesObj,
                [seriesId]: {
                    ...store.seriesObj[seriesId],
                    series_name: params.seriesName,
                    series_description: params.seriesDescription,
                    post_list: params.postList,
                    updatedAt: new Date().toISOString(),
                }
            }
            store.setSeriesObj(newSeriesObj)

            invalidatePaginatedPostsQuery(params.userId, params.queryClient)
        },
    })
}
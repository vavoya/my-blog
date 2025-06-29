import deleteBySession from "@/fetch/client/series/deleteBySession";
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
    postList: SeriesInfoResponse['post_list'];
    lastModified: UserInfoResponse['last_modified'];
    queryClient: QueryClient;
};
type Store = {
    seriesObj: SeriesObj;
    setSeriesObj: (newSeriesObj: SeriesObj) => void;
}
type CreateAddSeriesAsyncTask = (params: Params, store: Store) => AsyncTaskUnit;
export const createDeleteSeriesAsyncTask: CreateAddSeriesAsyncTask = (params, store) => {

    return typedAsyncTaskUnit({
        name: "시리즈 삭제",
        content: `이름[${params.seriesName}]`,
        time: new Date(),
        asyncTask: async (prevValue) => {
            // 1. fetch 요청 보내기
            const promise = deleteBySession({
                userId: params.userId,
                seriesId: params.seriesId,
                lastModified: prevValue ?? params.lastModified,
            })

            // 4. fetch 응답 처리
            const result = await promise;

            if (result.status === 200) {
                return {
                    status: "success",
                    data: {
                        seriesId: params.seriesId,
                    },
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
        successCallback(data) {
            const newSeriesId = data.seriesId;
            delete store.seriesObj[newSeriesId]
            const newSeriesObj = { ...store.seriesObj }
            store.setSeriesObj(newSeriesObj)

            invalidatePaginatedPostsQuery(params.userId, params.queryClient)
        },
    })
}
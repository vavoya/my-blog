import {AsyncTaskUnit, typedAsyncTaskUnit} from "@/lib/AsyncTaskManager";
import { UserInfoResponse } from "@/lib/mongoDB/types/documents/userInfo.type";
import {SeriesObj} from "@/components/modal/utils/toObj";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import postBySession from "@/fetch/client/series/postBySession";

type Params = {
    userId: UserInfoResponse['_id'];
    seriesName: SeriesInfoResponse['series_name'];
    lastModified: UserInfoResponse['last_modified'];
};
type Store = {
    seriesObj: SeriesObj;
    setSeriesObj: (newSeriesObj: SeriesObj) => void;
}
type CreateAddSereisAsyncTask = (params: Params, store: Store) => AsyncTaskUnit;
export const createAddSeriesAsyncTask: CreateAddSereisAsyncTask = (params, store) => {

    return typedAsyncTaskUnit({
        name: "시리즈 생성",
        content: `이름[${params.seriesName}]`,
        time: new Date(),
        asyncTask: async (prevValue) => {
            // 1. fetch 요청 보내기
            const promise = postBySession({
                userId: params.userId,
                seriesName: params.seriesName,
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
        successCallback(data) {
            const newSeriesId = data.seriesId;
            const newSeriesObj: SeriesObj = {
                ...store.seriesObj,
                [newSeriesId]: {
                    _id: newSeriesId,
                    series_name: params.seriesName,
                    series_description: "",
                    user_id: params.userId,
                    post_list: [],
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                }
            }
            store.setSeriesObj(newSeriesObj)
        },
    })
}
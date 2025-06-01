import patchBySession from "@/fetch/client/aboutInfo/patchBySession";
import {AsyncTaskUnit, typedAsyncTaskUnit} from "@/utils/AsyncTaskManager";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {AboutInfoResponse} from "@/lib/mongoDB/types/documents/aboutInfo.type";


type Params = {
    userId: AboutInfoResponse['user_id'];
    content: AboutInfoResponse['content'];
    lastModified: UserInfoResponse['last_modified'];
};

type CreateUpdateAboutAsyncTask = (params: Params) => AsyncTaskUnit;
export const createUpdateAboutAsyncTask: CreateUpdateAboutAsyncTask = (params) => {
    return typedAsyncTaskUnit({
        name: "소개글 업데이트",
        content: ``,
        time: new Date(),
        asyncTask: async (prevValue) => {
            // 1. fetch 요청 보내기
            const promise = patchBySession({
                lastModified: prevValue ?? params.lastModified,
                userId: params.userId,
                content: params.content
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

        },
    })
}
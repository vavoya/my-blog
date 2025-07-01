import {AsyncTaskUnit, typedAsyncTaskUnit} from "@/lib/AsyncTaskManager";
import removeAccountBySession from "@/fetch/client/remove-account/removeAccountBySession";


type Callback = {
    sessionUpdate: () => Promise<null>;
}
type CreateRemoveAccountAsyncTask = (callback: Callback) => AsyncTaskUnit;
export const createRemoveAccountAsyncTask: CreateRemoveAccountAsyncTask = (callback) => {
    return typedAsyncTaskUnit({
        name: "회원 탈퇴",
        content: `회원 탈퇴 후 종료됩니다.`,
        time: new Date(),
        asyncTask: async (prevValue) => {
            // 1. fetch 요청 보내기
            const promise = removeAccountBySession()

            // 4. fetch 응답 처리
            const result = await promise;

            if (result.status === 200) {
                return {
                    status: "success",
                    data: result,
                    nextValue: prevValue
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
            callback.sessionUpdate()
        },
    })
}
import {AsyncTaskUnit, typedAsyncTaskUnit} from "@/lib/AsyncTaskManager";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import updateUserBySession from "@/fetch/client/update-user/updateUserBySession";


type Params = {
    userInfo: UserInfoResponse;
    userId: UserInfoResponse['_id'];
    userName: UserInfoResponse['user_name'];
    blogName: UserInfoResponse['blog_name'];
    agreementsEmail: UserInfoResponse['agreements']['email'];
    lastModified: UserInfoResponse['last_modified'];
};
type Store = {
    setUserInfo: (newUserInfo: UserInfoResponse) => void;
}
type CreateUpdateUserAsyncTask = (params: Params, store: Store) => AsyncTaskUnit;
export const createUpdateUserAsyncTask: CreateUpdateUserAsyncTask = (params, store) => {
    return typedAsyncTaskUnit({
        name: "사용자 정보 갱신",
        content: `사용자 정보를 갱신합니다.`,
        time: new Date(),
        asyncTask: async (prevValue) => {
            // 1. fetch 요청 보내기
            const promise = updateUserBySession({
                userId: params.userId,
                userName: params.userName,
                blogName: params.blogName,
                agreementsEmail: params.agreementsEmail,
                lastModified: prevValue ?? params.lastModified,
            })

            // 4. fetch 응답 처리
            const result = await promise;

            console.log(result)

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
            store.setUserInfo({
                ...params.userInfo,
                user_name: params.userName,
                blog_name: params.blogName,
                agreements: {
                    ...params.userInfo.agreements,
                    email: params.agreementsEmail,
                },
                last_modified: params.lastModified,
            })
        },
    })
}
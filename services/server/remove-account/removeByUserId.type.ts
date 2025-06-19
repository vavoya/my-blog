import {UserInfoResponse, userInfoResponseShape,} from "@/lib/mongoDB/types/documents/userInfo.type";

export type RemoveInput = {
    userId: UserInfoResponse["_id"];
}
export const removeInputShape: RemoveInput = {
    userId: userInfoResponseShape["_id"],
}
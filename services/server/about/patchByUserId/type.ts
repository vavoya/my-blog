import {AboutInfoResponse, aboutInfoResponseShape} from "@/lib/mongoDB/types/documents/aboutInfo.type";

export type PatchInput = {
    userId: AboutInfoResponse["user_id"]
    content: AboutInfoResponse['content'];
}
export const patchInputShape: PatchInput = {
    userId: aboutInfoResponseShape["user_id"],
    content: aboutInfoResponseShape['content'],
}
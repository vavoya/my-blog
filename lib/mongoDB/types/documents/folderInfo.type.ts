import {ObjectId} from 'mongodb'
import {UserInfoDocument, UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";


export type FolderInfoDocument = {
    _id: ObjectId;
    user_id: UserInfoDocument['_id'];
    pfolder_id: FolderInfoDocument['_id'] | null;
    folder_name: string;
    post_count: number;
}

export type FolderInfoResponse = {
    _id: string;
    user_id: UserInfoResponse['_id'];
    pfolder_id: FolderInfoResponse['_id'] | null;
    folder_name: string;
    post_count: number;
}

export const folderInfoResponseShape = {
    _id: "string",
    user_id: "string",
    pfolder_id: "string",
    folder_name: "string",
    post_count: "number",
};
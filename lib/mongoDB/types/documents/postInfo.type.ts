import { ObjectId } from 'mongodb'
import {UserInfoDocument, UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {FolderInfoDocument, FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {SeriesInfoDocument} from "@/lib/mongoDB/types/documents/seriesInfo.type";


export type PostInfoDocument = {
    _id: ObjectId;
    user_id: UserInfoDocument['_id'];
    post_url: string;
    folder_id: FolderInfoDocument['_id'];
    post_name: string;
    post_createdAt: Date;
    post_updatedAt: Date;
    post_description: string;
    post_content: string;
    post_ast: object;
    thumb_url: string;
    series_id: SeriesInfoDocument['_id'] | null;
    viewCount: number;

}

export type PostInfoResponse = {
    _id: string;
    user_id: UserInfoResponse['_id'];
    post_url: string;
    folder_id: FolderInfoResponse['_id'];
    post_name: string;
    post_createdAt: string;
    post_updatedAt: string;
    post_description: string;
    post_content: string;
    post_ast: object;
    thumb_url: string;
    series_id: string | null;
    viewCount: number;
}

export const postInfoResponseShape = {
    _id: "string",
    user_id: "string",
    post_url: "string",
    folder_id: "string",
    post_name: "string",
    post_createdAt: "string",
    post_updatedAt: "string",
    post_description: "string",
    post_content: "string",
    post_ast: "string",
    thumb_url: "string",
    series_id: "string",
    viewCount: "number",
};

import { ObjectId } from 'mongodb'
import {UserInfoDocument, UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PostInfoDocument, PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";


export type SeriesInfoDocument = {
    _id: ObjectId;
    user_id: UserInfoDocument['_id'];
    series_name: string;
    series_description: string;
    post_list: PostInfoDocument["_id"][];
}

export type SeriesInfoResponse = {
    _id: string;
    user_id: UserInfoResponse['_id'];
    series_name: string;
    series_description: string;
    post_list: PostInfoResponse["_id"][];
}

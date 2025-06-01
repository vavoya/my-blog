import { ObjectId } from 'mongodb'


export type UserInfoDocument = {
    _id: ObjectId;
    auth_id: string;
    blog_name: string;
    user_name: string;
    email: string;
    blog_url: string;
    next_post_id: number;
    registration_state: boolean;
    last_modified: Date;
}

export type UserInfoResponse = {
    _id: string;
    auth_id: string;
    blog_name: string;
    user_name: string;
    email: string;
    blog_url: string;
    next_post_id: number;
    registration_state: boolean;
    last_modified: string;
}

export const userInfoResponseShape = {
    _id: "string",
    auth_id: "string",
    blog_name: "string",
    user_name: "string",
    email: "string",
    blog_url: "string",
    next_post_id: "number",
    registration_state: "boolean",
    last_modified: "string",
}
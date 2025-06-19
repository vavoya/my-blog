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
    is_deleted: boolean;
    last_login_at: Date;
    agreements: {
        terms: boolean;
        privacy: boolean;
        email: boolean;
    };
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
    is_deleted: boolean;
    last_login_at: string;
    agreements: {
        terms: boolean;
        privacy: boolean;
        email: boolean;
    };
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
    is_deleted: "boolean",
    last_login_at: "string",
    agreements: {
        terms: "boolean",
        privacy: "boolean",
        email: "boolean",
    },
}
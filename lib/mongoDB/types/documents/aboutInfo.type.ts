import { ObjectId } from 'mongodb'


export type AboutInfoDocument = {
    _id: ObjectId;
    user_id: AboutInfoDocument['_id'];
    content: string;
    ast: object;
}

export type AboutInfoResponse = {
    _id: string;
    user_id: AboutInfoResponse['_id'];
    content: string;
    ast: object;
}

export const aboutInfoResponseShape = {
    _id: "string",
    user_id: "string",
    content: "string",
    ast: "string",
};
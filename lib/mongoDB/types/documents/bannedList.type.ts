import {ObjectId} from "mongodb";




type BannedAuthListDocument = {
    _id: ObjectId;
    auth_id: string;
    reason: string;
    banned_at: Date;
}

export type {
    BannedAuthListDocument,
}
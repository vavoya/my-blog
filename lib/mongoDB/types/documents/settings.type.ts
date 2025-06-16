import {ObjectId} from "mongodb";


type AllowSignup = {
    _id: ObjectId;
    id: 'allow_signup';
    value: boolean;
    updated_at: Date;
}

type SettingsDocument = AllowSignup

export type {
    SettingsDocument,
    AllowSignup,
}
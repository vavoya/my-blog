import { client } from "@/lib/mongoDB/mongoClient";
import { COLLECTION_SETTINGS, DB } from "@/lib/mongoDB/const";
import {AllowSignup, SettingsDocument} from "@/lib/mongoDB/types/documents/settings.type";

export default async function isSignupAllowed(): Promise<boolean> {
    const coll = client.db(DB).collection<SettingsDocument>(COLLECTION_SETTINGS);

    const doc = await coll.findOne<AllowSignup>(
        { id: "allow_signup" },
        { projection: { value: 1 } }
    );

    return doc?.value ?? false;
}

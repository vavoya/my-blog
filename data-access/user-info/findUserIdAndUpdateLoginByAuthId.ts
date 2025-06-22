import {client} from "@/lib/mongoDB/mongoClient";
import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";
import {UserIdDocumentByAuthId} from "@/data-access/user-info/types";
import {COLLECTION_USER, DB} from "@/lib/mongoDB/const";
import {ClientSession} from "mongodb";

export default async function findUserIdAndUpdateLoginByAuthId(authId: UserInfoDocument["auth_id"], session?: ClientSession): Promise<UserIdDocumentByAuthId | null> {
    const coll = client.db(DB).collection<UserInfoDocument>(COLLECTION_USER);
    const filter = {
        auth_id: authId,
        is_deleted: false,
    };
    const update = {
        $set: {
            last_login_at: new Date()
        }
    };
    const projection = {
        _id: 1,
        registration_state: 1,
    };

    return await coll.findOneAndUpdate(
        filter,
        update,
        {
            projection,
            returnDocument: "after",
            session: session,
        }
    );
}

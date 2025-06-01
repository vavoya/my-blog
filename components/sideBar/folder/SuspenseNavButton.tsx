import {Suspense} from "react";
import DataProvider from "@/components/sideBar/folder/DataProvider";
import FallBackButton from "@/components/sideBar/folder/FallBackNavButton";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Url} from "@/components/sideBar/types";


export default function SuspenseNavButton({url, userId}: {url: Url, userId: UserInfoResponse['_id']}) {


    return (
        <Suspense fallback={<FallBackButton />}>
            <DataProvider url={url} userId={userId} />
        </Suspense>
    )
}
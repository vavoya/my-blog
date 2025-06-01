import {Suspense} from "react";
import DataProvider from "@/components/sideBar/series/DataProvider";
import FallBackButton from "@/components/sideBar/series/FallBackNavButton";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {Url} from "@/components/sideBar/types";


export default function SuspenseNavButton({url, userId}: {url: Url, userId: UserInfoResponse['_id']}) {


    return (
        <Suspense fallback={<FallBackButton />}>
            <DataProvider url={url} userId={userId} />
        </Suspense>
    )
}
import {useMemo} from "react";
import {getAsyncTaskManager} from "@/utils/AsyncTaskManager";


export default function useAsyncTaskManager(id: string = '0') {
    return useMemo(() => getAsyncTaskManager(id), [id]);
}
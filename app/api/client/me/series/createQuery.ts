import {createMeQuery} from "@/app/api/client/me/createQuery";


function createSeriesQuery() {
    return `${createMeQuery()}/series` as const
}

export {
    createSeriesQuery
}
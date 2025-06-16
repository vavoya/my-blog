import {createMeQuery} from "@/app/api/client/me/createQuery";


function createAboutQuery() {
    return `${createMeQuery()}/about` as const
}

export {
    createAboutQuery
}
import {createMeQuery} from "@/app/api/client/me/createQuery";


function createFolderQuery() {
    return `${createMeQuery()}/folders` as const
}

export {
    createFolderQuery
}
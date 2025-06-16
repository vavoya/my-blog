import {createMeQuery} from "@/app/api/client/me/createQuery";


function createPostQuery() {
    return `${createMeQuery()}/posts` as const
}

export {
    createPostQuery
}
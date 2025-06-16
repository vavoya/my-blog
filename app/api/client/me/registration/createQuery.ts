import {createMeQuery} from "@/app/api/client/me/createQuery";


function createRegistrationQuery() {
    return `${createMeQuery()}/registration` as const
}

export {
    createRegistrationQuery
}
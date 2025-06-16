

function createUserQuery() {
    return `${process.env.NEXT_PUBLIC_BASE_URL}/api/client/users` as const
}

export {
    createUserQuery
}

function createUserQuery() {
    return `${process.env.NEXT_PUBLIC_BASE_URL}/api/server/me/user` as const
}

export {
    createUserQuery
}
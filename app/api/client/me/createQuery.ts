

function createMeQuery() {
    return `${process.env.NEXT_PUBLIC_BASE_URL}/api/client/me` as const
}

export {
    createMeQuery
}
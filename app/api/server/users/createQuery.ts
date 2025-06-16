
function createUserQuery(blogUrl: string | null = null, authId: string | null = null) {
    const params = new URLSearchParams();
    if (authId) params.set("auth-id", authId);
    if (blogUrl) params.set("blog-url", blogUrl);
    const queryString = params.toString();
    return `${process.env.NEXT_PUBLIC_BASE_URL!}/api/server/users${queryString ? `?${queryString}` : ''}` as const;
}

export {
    createUserQuery
}

export const logRequestWithContext = (
    request: Request,
    pathname: string,
    message: string,
    level: "log" | "warn" | "error" = "error"
) => {
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const ua = request.headers.get("user-agent") || "unknown"

    const context = {
        path: pathname,
        ip,
        ua,
    }

    const logger = {
        log: console.log,
        warn: console.warn,
        error: console.error,
    }[level] ?? console.error

    logger(message, context)
}

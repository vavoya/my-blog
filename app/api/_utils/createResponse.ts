import {Response} from "@/app/api/types";


export const response = {
    ok<T>(data: T): Response<T> {
        return { status: 200, data }
    },
    badRequest(message: string): Response<never> {
        return { status: 400, message }
    },
    unauthorized(message: string): Response<never> {
        return { status: 401, message }
    },
    forbidden(message: string): Response<never> {
        return { status: 403, message }
    },
    notFound(message: string): Response<never> {
        return { status: 404, message }
    },
    timeout(message: string): Response<never> {
        return { status: 408, message }
    },
    conflict(message: string): Response<never> {
        return { status: 409, message }
    },
    toManyRequests(message: string): Response<never> {
        return { status: 429, message }
    },
    error(message: string): Response<never> {
        return { status: 500, message }
    },
}
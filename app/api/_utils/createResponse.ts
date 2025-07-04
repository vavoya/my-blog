import {Response} from "@/app/api/types";

/**
 * 표준화된 HTTP 응답 객체를 생성하는 유틸리티 메서드들을 포함한 객체입니다.
 * 각 메서드는 특정 HTTP 상태 코드를 갖는 응답 객체를 반환합니다.
 */
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
    failedDependency(message: string): Response<never> {
        return { status: 424, message }
    },
    toManyRequests(message: string): Response<never> {
        return { status: 429, message }
    },
    error(message: string): Response<never> {
        return { status: 500, message }
    },
}
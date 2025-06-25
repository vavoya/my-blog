import {beforeEach, describe, expect, test, vi} from "vitest";
import {NextAuthRequest} from "next-auth";
import type {PatchByUserIdResult} from '@/services/server/about/patchByUserId';

// nextjs 캐시 모킹
vi.mock('next/cache', () => ({
    revalidateTag: vi.fn()
}))

// 서비스 로직 파일 자체 모킹 (파일에 있는 mongoClient 실행 방지)
vi.mock('@/services/server/about/patchByUserId', () => ({
    default: vi.fn<() => Promise<PatchByUserIdResult>>(),
}));
// type 안전하게 모킹한 함수 가져오기
import patchByUserIdResult from '@/services/server/about/patchByUserId';
const patchByUserIdMock = vi.mocked(patchByUserIdResult)

// 세션 검증 모킹
vi.mock('@/app/api/_utils/checkAuth', () => ({
    checkAuth: vi.fn()
}))
import { checkAuth } from '@/app/api/_utils/checkAuth';
const checkAuthMock = vi.mocked(checkAuth);

// 핸들러 import
import {pathHandler} from "@/app/api/client/me/about/_handlers/patch";
import {jsonResponse} from "@/app/api/client/jsonResponse";
import {response} from "@/app/api/_utils/createResponse";

// 동적 모킹 초기화
beforeEach(() => {
    vi.restoreAllMocks();
})

describe('api/me/about 테스트', () => {
    test('성공', async () => {
        const lastModified = new Date();
        const userId = '1234567890';
        patchByUserIdMock.mockResolvedValue({
            success: true,
            data: {
                lastModified,
            }
        })
        checkAuthMock.mockResolvedValue(userId)

        const req = {
            method: 'PATCH',
            json: async () => ({
                userId: userId,
                content: 'test',
                lastModified: new Date().toISOString(),
            }),
        } as NextAuthRequest;

        const res = await pathHandler(req)
        const jsonObj = await res.json()
        expect(jsonObj).toEqual(expect.objectContaining({
            status: 200,
            data: {
                lastModified: lastModified.toISOString(),
            }
        }))
    })

    test('실패 - 세션 에러', async () => {
        const lastModified = new Date();

        checkAuthMock.mockResolvedValue(
            jsonResponse(response.unauthorized('인증 실패'))
        ); // 인증 실패 시나리오


        patchByUserIdMock.mockResolvedValue({
            success: true,
            data: {
                lastModified,
            }
        })

        const req = {
            method: 'PATCH',
            json: async () => ({
                userId: '1234567890',
                content: 'test',
                lastModified: new Date().toISOString(),
            }),
        } as NextAuthRequest;

        const res = await pathHandler(req)
        const jsonObj = await res.json()
        expect(jsonObj).toEqual(expect.objectContaining({
            status: 401,
        }))
    })

    test('실패 - 400', async () => {
        const userId = '1234567890';
        checkAuthMock.mockResolvedValue(userId)

        const lastModifiedTest = [
            null,
            undefined,
            '날짜가 아닌 데이터'
        ]
        const userIdTest = [
            null,
            undefined,
            []
        ]
        const contentTest = [
            null,
            undefined,
            '',
            []
        ]

        for (const lastModified of lastModifiedTest) {
            for (const userId of userIdTest) {
                for (const content of contentTest) {
                    console.log(`testing with lastModified=${lastModified}, userId=${userId}, content=${content}`)

                    const req = {
                        method: 'PATCH',
                        json: async () => ({
                            userId,
                            content,
                            lastModified
                        }),
                    } as NextAuthRequest

                    const res = await pathHandler(req)
                    const jsonObj = await res.json()
                    expect(jsonObj).toEqual(expect.objectContaining({
                        status: 400,
                    }))
                }
            }
        }
    })

    test('실패 - 404', async () => {
        const userId = '1234567890';
        checkAuthMock.mockResolvedValue(userId)

        const lastModified = new Date();
        patchByUserIdMock.mockResolvedValue({
            success: false,
            error: 'UserNotFound',
            message: ''
        })

        const req = {
            method: 'PATCH',
            json: async () => ({
                userId: '1234567890',
                content: 'test',
                lastModified: lastModified.toISOString(),
            }),
        } as NextAuthRequest;

        const res = await pathHandler(req)
        const jsonObj = await res.json()
        expect(jsonObj).toEqual(expect.objectContaining({
            status: 404,
        }))
    })

    test('실패 - 409', async () => {
        const userId = '1234567890';
        checkAuthMock.mockResolvedValue(userId)

        const lastModified = new Date();
        patchByUserIdMock.mockResolvedValue({
            success: false,
            error: 'LastModifiedMismatch',
            message: ''
        })

        const req = {
            method: 'PATCH',
            json: async () => ({
                userId: '1234567890',
                content: 'test',
                lastModified: lastModified.toISOString(),
            }),
        } as NextAuthRequest;

        const res = await pathHandler(req)
        const jsonObj = await res.json()
        expect(jsonObj).toEqual(expect.objectContaining({
            status: 409,
        }))
    })

    test('실패 - 500', async () => {
        const userId = '1234567890';
        checkAuthMock.mockResolvedValue(userId)

        const lastModified = new Date();
        const errorTest = [
            'UpdateAboutError',
            'TransactionError',
            'default case:'
        ] as any;

        for (const error of errorTest) {

            patchByUserIdMock.mockResolvedValue({
                success: false,
                error: error,
                message: ''
            })

            const req = {
                method: 'PATCH',
                json: async () => ({
                    userId: '1234567890',
                    content: 'test',
                    lastModified: lastModified.toISOString(),
                }),
            } as NextAuthRequest;

            const res = await pathHandler(req)
            const jsonObj = await res.json()
            expect(jsonObj).toEqual(expect.objectContaining({
                status: 500,
            }))
        }
    })

    test('실패 - 500 (catch)', async () => {
        const userId = '1234567890';
        checkAuthMock.mockResolvedValue(userId)

        patchByUserIdMock.mockImplementation(() => {
            throw new Error("에러")
        })

        const req = {
            method: 'PATCH',
            json: async () => ({
                userId: '1234567890',
                content: 'test',
                lastModified: new Date().toISOString(),
            }),
        } as NextAuthRequest;

        const res = await pathHandler(req)
        const jsonObj = await res.json()
        expect(jsonObj).toEqual(expect.objectContaining({
            status: 500,
        }))
    })
})
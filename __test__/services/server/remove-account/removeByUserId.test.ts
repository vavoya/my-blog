import { beforeAll, afterAll, test, expect, vi, describe } from 'vitest';

import {
    setupMemoryMongo,
    getClient,
    getDb,
    teardownMemoryMongo,
} from '@/__test__/_memory/memory-server';

import {loadFixture} from "@/__test__/_memory/load-fixture";
import {
    commonFixture, userIdString,
} from "@/__test__/_memory/fixtures/common";
import removeByUserId from "@/services/server/remove-account/removeByUserId";
import * as deleteToken from "@/fetch/server/naver/deleteToken";

// 1. 정적 mock 선언 (vi.mock)
vi.mock('@/lib/mongoDB/mongoClient', async () => {
    await setupMemoryMongo();
    return {
        client: getClient(),
    };
});

beforeAll(async () => {
    await loadFixture(getDb(), commonFixture);
});

afterAll(async () => {
    await teardownMemoryMongo();
});

describe('회원 탈퇴 검증', () => {
    test('회원 탈퇴 - 1. 없는 계정', async () => {
        vi.spyOn(deleteToken, 'default').mockResolvedValue({
            status: 200,
            data: {
                access_token: '',
                result: 'success',
            }
        })

        const result = await removeByUserId({
            userId: '64e100000000000000000009',
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UserNotFound'
        }));
    })

    test('회원 탈퇴 - 2. 네이버 실패', async () => {
        vi.spyOn(deleteToken, 'default').mockResolvedValue({
            status: 200,
            data: {
                access_token: '',
                result: 'failed',
            }
        })

        const result = await removeByUserId({
            userId: userIdString,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'NaverOAuthUnlinkFailed'
        }));
    })

    test('회원 탈퇴 - 성공', async () => {
        vi.spyOn(deleteToken, 'default').mockResolvedValue({
            status: 200,
            data: {
                access_token: '',
                result: 'success',
            }
        })

        const result = await removeByUserId({
            userId: userIdString,
        });

        expect(result).toEqual(expect.objectContaining({
            success: true,
        }));
    })

    test('회원 탈퇴 - 트랜잭션 실패', async () => {
        vi.spyOn(deleteToken, 'default').mockResolvedValue({
            status: 200,
            data: {
                access_token: '',
                result: 'success',
            }
        })

        vi.spyOn(getClient(), 'db').mockImplementation(() => {
            throw new Error('강제로 실패시킴');
        })

        const result = await removeByUserId({
            userId: userIdString,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'TransactionError'
        }));
    })
})


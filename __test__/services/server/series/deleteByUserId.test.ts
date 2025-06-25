import {afterAll, test, expect, vi, describe, beforeEach} from 'vitest';

import {
    setupMemoryMongo,
    getClient,
    getDb,
    teardownMemoryMongo,
} from '@/__test__/_memory/memory-server';

import {loadFixture} from "@/__test__/_memory/load-fixture";
import {
    commonFixture,
    lastModifiedString, seriesIdString,
    userIdString
} from "@/__test__/_memory/fixtures/common";
import deleteByUserId from "@/services/server/series/deleteByUserId";
import * as updateManyByPostIds from "@/data-access/post-info/updateManyByPostIds";

// 1. 정적 mock 선언 (vi.mock)
vi.mock('@/lib/mongoDB/mongoClient', async () => {
    await setupMemoryMongo();
    return {
        client: getClient(),
    };
});

beforeEach(async () => {
    vi.restoreAllMocks()
    await loadFixture(getDb(), commonFixture);
});

afterAll(async () => {
    await teardownMemoryMongo();
});

const lastModified = lastModifiedString;

describe('시리즈 삭제 검증', () => {
    test('시리즈 삭제 - 성공', async () => {
        const result = await deleteByUserId({
            userId: userIdString,
            seriesId: seriesIdString,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: true,
        }));
    })

    test('시리즈 삭제 - lastModified 에러', async () => {
        const result = await deleteByUserId({
            userId: userIdString,
            seriesId : seriesIdString,
            lastModified: '2022-02-01T00:00:00.000Z',
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'LastModifiedMismatch'
        }));
    });

    test('시리즈 삭제 - userId 에러', async () => {
        const result = await deleteByUserId({
            userId: '64e100000000000000000002',
            seriesId: seriesIdString,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UserNotFound'
        }));
    });

    test('시리즈 삭제 - 1. 잘못된 seriesId', async () => {
        const result = await deleteByUserId({
            userId: userIdString,
            seriesId: '000100000000000000000000',
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'DeleteFailed'
        }));
    });

    test('시리즈 삭제 - 2. 포스트 갱신 실패', async () => {
        vi.spyOn(updateManyByPostIds, 'default').mockResolvedValue({
            acknowledged: false,
            matchedCount: 0,
            modifiedCount: 0,
            upsertedCount: 0,
            upsertedId: null
        })

        const result = await deleteByUserId({
            userId: userIdString,
            seriesId: seriesIdString,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UpdatePostFailed'
        }));
    });

    test('시리즈 삭제 - 트랜잭션 실패', async () => {
        vi.spyOn(getClient(), 'db').mockImplementation(() => {
            throw new Error('강제로 실패시킴');
        })

        const result = await deleteByUserId({
            userId: userIdString,
            seriesId: seriesIdString,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'TransactionError'
        }));
    })
})



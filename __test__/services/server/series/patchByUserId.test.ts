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
import patchByUserId from "@/services/server/series/patchByUserId";
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

describe('시리즈 수정 검증', () => {
    test('시리즈 수정 - 성공', async () => {
        const result = await patchByUserId({
            newPostList: [],
            seriesDescription: "",
            seriesId: seriesIdString,
            seriesName: "",
            userId: userIdString,
            lastModified: lastModified
        });

        expect(result).toEqual(expect.objectContaining({
            success: true,
        }));
    })

    test('시리즈 수정 - 1. 잘못된 seriesId', async () => {
        const result = await patchByUserId({
            newPostList: [],
            seriesDescription: "",
            seriesId: '64e100000000000000000000',
            seriesName: "",
            userId: userIdString,
            lastModified: lastModified
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UpdateFailed'
        }));
    })

    test('시리즈 수정 - 2. 포스트 갱신 실패', async () => {
        vi.spyOn(updateManyByPostIds, 'default').mockResolvedValue({
            acknowledged: false,
            matchedCount: 0,
            modifiedCount: 0,
            upsertedCount: 0,
            upsertedId: null
        })

        const result = await patchByUserId({
            newPostList: [],
            seriesDescription: "",
            seriesId: seriesIdString,
            seriesName: "",
            userId: userIdString,
            lastModified: lastModified
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UpdateFailed'
        }));
    })

    test('시리즈 수정 - 잘못된 userId', async () => {
        const result = await patchByUserId({
            newPostList: [],
            seriesDescription: "",
            seriesId: seriesIdString,
            seriesName: "",
            userId: '64e100000000000000000000',
            lastModified: lastModified
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UserNotFound'
        }));
    })

    test('시리즈 수정 - lastModified 에러', async () => {
        const result = await patchByUserId({
            newPostList: [],
            seriesDescription: "",
            seriesId: seriesIdString,
            seriesName: "",
            userId: userIdString,
            lastModified: '2000.02.01T00:00:00.000Z',
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'LastModifiedMismatch'
        }));
    })

    test('시리즈 수정 - 트랜잭션 실패', async () => {
        vi.spyOn(getClient(), 'db').mockImplementation(() => {
            throw new Error('강제로 실패시킴');
        })

        const result = await patchByUserId({
            newPostList: [],
            seriesDescription: "",
            seriesId: seriesIdString,
            seriesName: "",
            userId: userIdString,
            lastModified: lastModified
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'TransactionError'
        }));
    })
})


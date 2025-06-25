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
    lastModifiedString,
    userIdString
} from "@/__test__/_memory/fixtures/common";
import postByUserId from "@/services/server/series/postByUserId";
import * as insertOne from "@/data-access/series-info/insertOne";
import {ObjectId} from "mongodb";

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

describe('시리즈 생성 검증', () => {
    test('시리즈 생성 - 성공', async () => {
        const result = await postByUserId({
            seriesName: "",
            userId: userIdString,
            lastModified: lastModified
        });

        expect(result).toEqual(expect.objectContaining({
            success: true,
        }));
    })

    test('시리즈 생성 - lastModified 에러', async () => {
        const result = await postByUserId({
            seriesName: "",
            userId: userIdString,
            lastModified: '2022-02-01T00:00:00.000Z',
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'LastModifiedMismatch'
        }));
    });

    test('시리즈 생성 - userId 에러', async () => {
        const result = await postByUserId({
            userId: '64e100000000000000000002',
            seriesName: "",
            lastModified: lastModified
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UserNotFound'
        }));
    });

    test('시리즈 생성 - 시리즈 생성 실패', async () => {
        vi.spyOn(insertOne, 'default').mockResolvedValue({
            acknowledged: false,
            insertedId: new ObjectId
        })

        const result = await postByUserId({
            seriesName: "",
            userId: userIdString,
            lastModified: lastModified
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'InsertFailed'
        }));
    })

    test('시리즈 생성 - 트랜잭션 실패', async () => {
        vi.spyOn(getClient(), 'db').mockImplementation(() => {
            throw new Error('강제로 실패시킴');
        })

        const result = await postByUserId({
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


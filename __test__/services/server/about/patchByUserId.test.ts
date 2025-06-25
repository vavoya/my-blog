import {afterAll, test, expect, vi, describe, beforeEach} from 'vitest';

import {
    setupMemoryMongo,
    getClient,
    getDb,
    teardownMemoryMongo,
} from '@/__test__/_memory/memory-server';

import patchByUserId from '@/services/server/about/patchByUserId';
import {loadFixture} from "@/__test__/_memory/load-fixture";
import {commonFixture, lastModifiedString, userIdString} from "@/__test__/_memory/fixtures/common";
import {COLLECTION_ABOUT} from "@/lib/mongoDB/const";

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
})

afterAll(async () => {
    await teardownMemoryMongo();
});

const lastModified= lastModifiedString;

describe('소개글 수정 검증', () => {
    test('소개글 수정 - 정상 동작', async () => {
        const result = await patchByUserId({
            userId: userIdString,
            lastModified: lastModified,
            content: '새 소개글',
        });

        expect(result).toEqual(expect.objectContaining({
            success: true,
        }));
    });

    test('소개글 수정 - lastModified 에러', async () => {
        const result = await patchByUserId({
            userId: userIdString,
            lastModified: '2022-01-02T00:00:00.000Z',
            content: '새 소개글',
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'LastModifiedMismatch'
        }));
    });

    test('소개글 수정 - userId 에러', async () => {
        const result = await patchByUserId({
            userId: '64e100000000000000000000',
            lastModified: lastModified,
            content: '새 소개글',
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UserNotFound'
        }));
    });

    test('소개글 수정 - 트랜잭션 에러', async () => {
        vi.spyOn(getClient(), 'db').mockImplementation(() => {
            throw new Error('강제로 실패시킴');
        })

        const result = await patchByUserId({
            userId: userIdString,
            lastModified: lastModified,
            content: '새 소개글',
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'TransactionError'
        }));
    });

    test('소개글 수정 - about 없는 에러', async () => {
        await getDb().collection(COLLECTION_ABOUT).deleteMany({});

        const result = await patchByUserId({
            userId: userIdString,
            lastModified: lastModified,
            content: '새 소개글',
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UpdateAboutError'
        }));
    });

})


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
    folderId1String,
    folderId2String,
    lastModifiedString,
    userIdString
} from "@/__test__/_memory/fixtures/common";
import moveByUserId from "@/services/server/folder/moveByUserId";

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

describe('폴더 이동 검증', () => {
    test('폴더 이동 - 성공', async () => {
        const result = await moveByUserId({
            userId: userIdString,
            folderId: folderId2String,
            pFolderId: folderId1String,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: true,
        }));
    })

    test('폴더 이동 - lastModified 에러', async () => {
        const result = await moveByUserId({
            userId: userIdString,
            folderId: folderId2String,
            pFolderId: folderId1String,
            lastModified: '2022-02-01T00:00:00.000Z',
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'LastModifiedMismatch'
        }));
    });

    test('폴더 이동 - userId 에러', async () => {
        const result = await moveByUserId({
            userId: '64e100000000000000000002',
            folderId: folderId2String,
            pFolderId: folderId1String,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UserNotFound'
        }));
    });

    test('폴더 이동 - 2. 잘못된 폴더 ID(이동하는 폴더 - 자식)', async () => {

        const result = await moveByUserId({
            userId: userIdString,
            folderId: '123456789012345678901234',
            pFolderId: folderId1String,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UpdateFailed'
        }));
    });

    test('폴더 이동 - 1. 잘못된 폴더 ID(타겟 폴더 - 부모)', async () => {

        const result = await moveByUserId({
            userId: userIdString,
            folderId: folderId2String,
            pFolderId: '123456789012345678901234',
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'pForderNotFound'
        }));
    });

    test('폴더 이동 - 트랜잭션 실패', async () => {
        vi.spyOn(getClient(), 'db').mockImplementation(() => {
            throw new Error('강제로 실패시킴');
        })

        const result = await moveByUserId({
            userId: userIdString,
            folderId: folderId2String,
            pFolderId: '123456789012345678901234',
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'TransactionError'
        }));
    });
})


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
    lastModifiedString,
    userIdString
} from "@/__test__/_memory/fixtures/common";
import renameByUserId from "@/services/server/folder/renameByUserId";

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
const folderName = "새 폴더"

describe('폴더 이름 검증', () => {
    test('폴더 이름 - 성공', async () => {
        const result = await renameByUserId({
            userId: userIdString,
            folderId: folderId1String,
            folderName: folderName,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: true,
        }));
    })

    test('폴더 이름 - lastModified 에러', async () => {
        const result = await renameByUserId({
            userId: userIdString,
            folderId : folderId1String,
            folderName: folderName,
            lastModified: '2022-02-01T00:00:00.000Z',
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'LastModifiedMismatch'
        }));
    });

    test('폴더 이름 - userId 에러', async () => {
        const result = await renameByUserId({
            userId: '64e100000000000000000002',
            folderId: folderId1String,
            folderName: folderName,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UserNotFound'
        }));
    });

    test('폴더 생성 - 2. 잘못된 폴더 ID', async () => {

        const result = await renameByUserId({
            userId: userIdString,
            folderId: '123456789012345678901234',
            folderName: folderName,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UpdateFailed'
        }));
    });

    test('폴더 생성 - 트랜잭션 실패', async () => {
        vi.spyOn(getClient(), 'db').mockImplementation(() => {
            throw new Error('강제로 실패시킴');
        })

        const result = await renameByUserId({
            userId: userIdString,
            folderId: '123456789012345678901234',
            folderName: folderName,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'TransactionError'
        }));
    });
})


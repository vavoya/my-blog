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
import {COLLECTION_ABOUT} from "@/lib/mongoDB/const";
import deleteByUserId from "@/services/server/folder/deleteByUserId";
import * as movePostsByFolderId from "@/data-access/post-info/movePostsByFolderId";
import * as updateManyByPFolderId from "@/data-access/folder-info/updateManyByPFolderId";
import * as findOneAndUpdatePostCount from "@/data-access/folder-info/findOneAndUpdatePostCount";

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

let lastModified= lastModifiedString;

describe('폴더 삭제 검증', () => {
    test('폴더 삭제 - lastModified 에러', async () => {
        const result = await deleteByUserId({
            userId: userIdString,
            folderId: folderId2String,
            lastModified: '2022-02-01T00:00:00.000Z',
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'LastModifiedMismatch'
        }));
    });

    test('폴더 삭제 - userId 에러', async () => {
        const result = await deleteByUserId({
            userId: '64e100000000000000000002',
            folderId: folderId2String,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UserNotFound'
        }));
    });

    test('폴더 삭제 - 잘못된 폴더 ID', async () => {
        await getDb().collection(COLLECTION_ABOUT).deleteMany({});

        const result = await deleteByUserId({
            userId: userIdString,
            folderId: '123456789012345678901234',
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'DeleteFailed'
        }));
    });

    test('폴더 삭제 - 루트 폴더 삭제 접근(에러)', async () => {
        await getDb().collection(COLLECTION_ABOUT).deleteMany({});

        const result = await deleteByUserId({
            userId: userIdString,
            folderId: folderId1String,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'FolderNotFound'
        }));
    });

    test('폴더 삭제 - movePostsByFolderId acknowledged: false', async () => {
        vi.spyOn(movePostsByFolderId, 'default').mockResolvedValue({
            acknowledged: false,
            modifiedCount: 0,
            matchedCount: 0,
            upsertedCount: 0,
            upsertedId: null
        });

        const result = await deleteByUserId({
            userId: userIdString,
            folderId: folderId2String,
            lastModified: lastModified,
        });

        if (result.success) {
            lastModified = result.data.lastModified.toISOString();
        }

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UpdatePostFailed'
        }));
    });

    test('폴더 삭제 - updateManyByPFolderId acknowledged: false', async () => {
        vi.spyOn(updateManyByPFolderId, 'default').mockResolvedValue({
            acknowledged: false,
            modifiedCount: 0,
            matchedCount: 0,
            upsertedCount: 0,
            upsertedId: null
        });

        const result = await deleteByUserId({
            userId: userIdString,
            folderId: folderId2String,
            lastModified: lastModified,
        });

        if (result.success) {
            lastModified = result.data.lastModified.toISOString();
        }

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UpdateFolderFailed'
        }));
    });

    test('폴더 삭제 - 주석 3번', async () => {
        vi.spyOn(findOneAndUpdatePostCount, 'default').mockResolvedValue(null);

        const result = await deleteByUserId({
            userId: userIdString,
            folderId: folderId2String,
            lastModified: lastModified,
        });

        if (result.success) {
            lastModified = result.data.lastModified.toISOString();
        }

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'FolderNotFound'
        }));
    });

    test('폴더 삭제 - 정상 동작', async () => {
        const result = await deleteByUserId({
            userId: userIdString,
            folderId: folderId2String,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: true,
        }));
    });

    test('폴더 삭제 - 트랜잭션 실패', async () => {
        vi.spyOn(getClient(), 'db').mockImplementation(() => {
            throw new Error('강제로 실패시킴');
        })

        const result = await deleteByUserId({
            userId: userIdString,
            folderId: folderId2String,
            lastModified: lastModified,
        });

        if (result.success) {
            lastModified = result.data.lastModified.toISOString();
        }

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'TransactionError'
        }));
    });
})


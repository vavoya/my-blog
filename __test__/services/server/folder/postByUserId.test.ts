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
import postByUserId from "@/services/server/folder/postByUserId";
import * as insertOne from "@/data-access/folder-info/insertOne";
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
const folderName = "새 폴더"

describe('폴더 생성 검증', () => {
    test('폴더 생성 - 성공', async () => {
        const result = await postByUserId({
            userId: userIdString,
            pFolderId: folderId1String,
            folderName: folderName,
            lastModified: lastModified,
        });


        expect(result).toEqual(expect.objectContaining({
            success: true,
        }));
    })

    test('폴더 생성 - lastModified 에러', async () => {
        const result = await postByUserId({
            userId: userIdString,
            pFolderId: folderId1String,
            folderName: folderName,
            lastModified: '2022-02-01T00:00:00.000Z',
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'LastModifiedMismatch'
        }));
    });

    test('폴더 생성 - userId 에러', async () => {
        const result = await postByUserId({
            userId: '64e100000000000000000002',
            pFolderId: folderId1String,
            folderName: folderName,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UserNotFound'
        }));
    });

    test('폴더 생성 - 1. 잘못된 부모 폴더 ID', async () => {

        const result = await postByUserId({
            userId: userIdString,
            pFolderId: '123456789012345678901234',
            folderName: folderName,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'FolderNotFound'
        }));
    });

    test('폴더 생성 - 2. 폴더 생성 실패', async () => {
        vi.spyOn(insertOne, 'default').mockResolvedValue({
            acknowledged: false,
            insertedId: new ObjectId(),
        })

        const result = await postByUserId({
            userId: userIdString,
            pFolderId: folderId1String,
            folderName: folderName,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'InsertFailed'
        }));
    });

    test('폴더 생성 - 트랜잭션 실패', async () => {
        vi.spyOn(getClient(), 'db').mockImplementation(() => {
            throw new Error('강제로 실패시킴');
        })

        const result = await postByUserId({
            userId: userIdString,
            pFolderId: '123456789012345678901234',
            folderName: folderName,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'TransactionError'
        }));
    });
})


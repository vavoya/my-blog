import {beforeAll, afterAll, test, expect, vi, describe, beforeEach} from 'vitest';

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
    lastModifiedString, postId1String,
    userIdString
} from "@/__test__/_memory/fixtures/common";
import patchByUserId from "@/services/server/post/patchByUserId";
import {COLLECTION_FOLDER} from "@/lib/mongoDB/const";
import {ObjectId} from "mongodb";
import * as findOneAndUpdateByPostId from "@/data-access/post-info/findOneAndUpdateByPostId";

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

describe('포스트 수정 검증', () => {
    test('포스트 수정 - 성공', async () => {
        const result = await patchByUserId({
            userId: userIdString,
            _id: postId1String,
            folderId: folderId1String,
            postContent: "아아아",
            postDescription: "",
            postName: "후후후",
            thumbUrl: "",
            lastModified: lastModified
        });

        expect(result).toEqual(expect.objectContaining({
            success: true,
        }));
    })

    test('포스트 수정 - lastModified 에러', async () => {
        const result = await patchByUserId({
            userId: userIdString,
            _id: postId1String,
            folderId: folderId1String,
            postContent: "아아아",
            postDescription: "",
            postName: "후후후",
            thumbUrl: "",
            lastModified: '2022-02-01T00:00:00.000Z',
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'LastModifiedMismatch'
        }));
    });

    test('포스트 수정 - userId 에러', async () => {
        const result = await patchByUserId({
            userId: '64e100000000000000000002',
            _id: postId1String,
            folderId: folderId1String,
            postContent: "아아아",
            postDescription: "",
            postName: "후후후",
            thumbUrl: "",
            lastModified: lastModified
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UserNotFound'
        }));
    });

    test('포스트 수정 - 1. 잘못된 postId', async () => {
        const result = await patchByUserId({
            userId: userIdString,
            _id: '64e100000000000000000002',
            folderId: folderId1String,
            postContent: "아아아",
            postDescription: "",
            postName: "후후후",
            thumbUrl: "",
            lastModified: lastModified
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'PostNotFound'
        }))
    })

    test('포스트 수정 - 2. folder post 무결성(folder 부제)', async () => {
        await getDb().collection(COLLECTION_FOLDER).findOneAndDelete({
            user_id: new ObjectId(userIdString),
            _id: new ObjectId(folderId1String)
        })

        const result = await patchByUserId({
            userId: userIdString,
            _id: postId1String,
            folderId: folderId1String,
            postContent: "아아아",
            postDescription: "",
            postName: "후후후",
            thumbUrl: "",
            lastModified: lastModified
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UpdateFolderError'
        }))
    })

    // 발생할 꺼면 1번에서 걸리지만, 임의로 발생시키기
    test('포스트 수정 - 3. post 수정 실패)', async () => {
        vi.spyOn(findOneAndUpdateByPostId, 'default').mockResolvedValue(null)

        const result = await patchByUserId({
            userId: userIdString,
            _id: postId1String,
            folderId: folderId1String,
            postContent: "아아아",
            postDescription: "",
            postName: "후후후",
            thumbUrl: "",
            lastModified: lastModified
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UpdatePostError'
        }))
    })

    test('포스트 수정 - 트랜잭션 실패', async () => {
        vi.spyOn(getClient(), 'db').mockImplementation(() => {
            throw new Error('강제로 실패시킴');
        })

        const result = await patchByUserId({
            userId: userIdString,
            _id: postId1String,
            folderId: folderId1String,
            postContent: "아아아",
            postDescription: "",
            postName: "후후후",
            thumbUrl: "",
            lastModified: lastModified
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'TransactionError'
        }));
    })
})


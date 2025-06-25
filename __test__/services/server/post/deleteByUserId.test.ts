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
    lastModifiedString, postId1String,
    userIdString
} from "@/__test__/_memory/fixtures/common";
import deleteByUserId from "@/services/server/post/deleteByUserId";
import {COLLECTION_POST} from "@/lib/mongoDB/const";
import {ObjectId} from "mongodb";
import * as removePosts from "@/data-access/series-info/removePosts";

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

describe('포스트 삭제 검증', () => {
    test('포스트 삭제 - 성공', async () => {
        const result = await deleteByUserId({
            userId: userIdString,
            postId: postId1String,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: true,
        }));
    })

    test('포스트 삭제 - lastModified 에러', async () => {
        const result = await deleteByUserId({
            userId: userIdString,
            postId : postId1String,
            lastModified: '2022-02-01T00:00:00.000Z',
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'LastModifiedMismatch'
        }));
    });

    test('포스트 삭제 - userId 에러', async () => {
        const result = await deleteByUserId({
            userId: '64e100000000000000000002',
            postId: postId1String,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UserNotFound'
        }));
    });

    test('포스트 삭제 - 1. 잘못된 postId', async () => {
        const result = await deleteByUserId({
            userId: userIdString,
            postId: '64e100000000000000000002',
            lastModified: lastModified,
        })

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'DeleteFailed'
        }));
    })

    test('포스트 삭제 - 2. 시리즈 업데이트 실패', async () => {
        vi.spyOn(removePosts, 'default').mockResolvedValue({
            acknowledged: false,
            matchedCount: 0,
            modifiedCount: 0,
            upsertedCount: 0,
            upsertedId: null
        })

        const result = await deleteByUserId({
            userId: userIdString,
            postId: postId1String,
            lastModified: lastModified,
        })

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'DeleteFailed'
        }));
    })

    test('포스트 삭제 - 3. postInfo에 folderId 이상', async () => {
        await getDb().collection(COLLECTION_POST).findOneAndUpdate({
            user_id: new ObjectId(userIdString),
            _id: new ObjectId(postId1String),
        }, {
            $set: {
                folder_id: new ObjectId(),
            }
        })

        const result = await deleteByUserId({
            userId: userIdString,
            postId: postId1String,
            lastModified: lastModified,
        })

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'FolderNotFound'
        }));
    })

    test('포스트 삭제 - 트랜잭션 실패', async () => {
        vi.spyOn(getClient(), 'db').mockImplementation(() => {
            throw new Error('강제로 실패시킴');
        })

        const result = await deleteByUserId({
            userId: userIdString,
            postId: postId1String,
            lastModified: lastModified,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'TransactionError'
        }));
    })
})


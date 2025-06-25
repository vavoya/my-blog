import {afterAll, test, expect, vi, describe, beforeEach} from 'vitest';

import {
    setupMemoryMongo,
    getClient,
    getDb,
    teardownMemoryMongo,
} from '@/__test__/_memory/memory-server';

import {loadFixture} from "@/__test__/_memory/load-fixture";
import {commonFixture, folderId1String, userIdString} from "@/__test__/_memory/fixtures/common";
import {ObjectId} from "mongodb";
import getPaginatedPostsByFolderId from "@/data-access/post-info/getPaginatedPostsByFolderId";
import {LIMIT} from "@/const/page";

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

describe('페이지네이션 포스트 얻기', () => {
    test('페이지네이션 포스트 얻기 - 성공', async () => {
        const result = await getPaginatedPostsByFolderId(
            new ObjectId(userIdString),
            new ObjectId(folderId1String),
            1,
        );
        expect(result).toMatchObject(
            commonFixture.post_info
                .filter(value => value.folder_id.toString() === folderId1String)
                .sort((a, b) => b.post_createdAt.getTime() - a.post_createdAt.getTime())
                .slice(0, LIMIT)
                .map(v => ({
                    post_url: v.post_url,
                    post_description: v.post_description,
                    post_name: v.post_name,
                    post_createdAt: v.post_createdAt,
                    post_updatedAt: v.post_updatedAt,
                    thumb_url: v.thumb_url,
                    folder_id: v.folder_id,
                    series_id: v.series_id,
                }))
        )
    });

    test('페이지네이션 포스트 얻기 - 실패', async () => {
        const result = await getPaginatedPostsByFolderId(
            new ObjectId('012345678901234567891234'),
            new ObjectId(folderId1String),
            1,
        );
        expect(result).toMatchObject([])
    });

})


import {afterAll, test, expect, vi, describe, beforeEach} from 'vitest';

import {
    setupMemoryMongo,
    getClient,
    getDb,
    teardownMemoryMongo,
} from '@/__test__/_memory/memory-server';

import {loadFixture} from "@/__test__/_memory/load-fixture";
import {commonFixture, userIdString} from "@/__test__/_memory/fixtures/common";
import {ObjectId} from "mongodb";
import getPostsByPostIds from "@/data-access/post-info/getPostsByPostIds";

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

describe('페이지네이션 포스트 얻기(postIds)', () => {
    test('페이지네이션 포스트 얻기(postIds) - 성공', async () => {
        const result = await getPostsByPostIds(
            new ObjectId(userIdString),
            commonFixture.post_info.filter(value => value.user_id.toString() === userIdString).map(v => v._id),
        );
        expect(result).toMatchObject(
            commonFixture.post_info
                .filter(value => value.user_id.toString() === userIdString)
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

    test('페이지네이션 포스트 얻기(postIds) - 실패', async () => {
        const result = await getPostsByPostIds(
            new ObjectId('012345678901234567891234'),
            []
        );
        expect(result).toMatchObject([])
    });

})


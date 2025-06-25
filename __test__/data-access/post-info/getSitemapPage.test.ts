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
import getSitemapPage from "@/data-access/post-info/getSitemapPage";
import {LIMIT} from "@/const/sitemap";

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

describe('포스트 사이트맵', () => {
    test('포스트 사이트맵 - 성공', async () => {
        const result = await getSitemapPage(
            new ObjectId(userIdString),
            1,
        );

        expect(result).toMatchObject(
            commonFixture.post_info
                .filter(value => value.user_id.toString() === userIdString)
                .sort((a, b) => b.post_createdAt.getTime() - a.post_createdAt.getTime())
                .slice(0, LIMIT)
                .map(v => ({
                    post_url: v.post_url,
                    post_updatedAt: v.post_updatedAt,
                }))
        )
    });

    test('포스트 사이트맵 - 실패', async () => {
        const result = await getSitemapPage(
            new ObjectId('012345678901234567891234'),
            1,
        );

        expect(result).toMatchObject([])
    });
})


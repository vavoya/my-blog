import {afterAll, test, expect, vi, describe, beforeEach} from 'vitest';

import {
    setupMemoryMongo,
    getClient,
    getDb,
    teardownMemoryMongo,
} from '@/__test__/_memory/memory-server';

import {loadFixture} from "@/__test__/_memory/load-fixture";
import {commonFixture} from "@/__test__/_memory/fixtures/common";
import getSitemapPage from "@/data-access/user-info/getSitemapPage";
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
            1,
        );

        expect(result).toMatchObject(
            commonFixture.user_info
                .slice(0, LIMIT)
                .map(v => ({
                    user_name: v.user_name,
                    blog_url: v.blog_url,
                }))
        )
    });
})


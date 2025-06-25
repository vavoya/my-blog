import {afterAll, test, expect, vi, describe, beforeEach} from 'vitest';

import {
    setupMemoryMongo,
    getClient,
    getDb,
    teardownMemoryMongo,
} from '@/__test__/_memory/memory-server';

import {loadFixture} from "@/__test__/_memory/load-fixture";
import {commonFixture, folderId1String, postId14String, userIdString} from "@/__test__/_memory/fixtures/common";
import {ObjectId} from "mongodb";
import getPostByPostUrl from "@/data-access/post-info/getPostByPostUrl";

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

describe('포스트 얻기(postUrl)', () => {
    test('포스트 얻기(postUrl) - 성공', async () => {
        const post14 = commonFixture.post_info.find(value => value._id.toString() === postId14String)!;

        const result = await getPostByPostUrl(
            new ObjectId(userIdString),
            post14.post_url,
        );

        expect(result).toMatchObject(post14)
    });

    test('포스트 얻기(postUrl) - 실패', async () => {
        const result = await getPostByPostUrl(
            new ObjectId(userIdString),
            '없어요-test-1',
        );
        expect(result).toBeNull()
    });
})


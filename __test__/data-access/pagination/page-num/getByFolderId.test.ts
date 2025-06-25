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
import getByFolderId from "@/data-access/pagination/page-num/getByFolderId";

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

describe('포스트 폴더 페이지 번호 얻기', () => {
    test('포스트 폴더 페이지 번호 얻기 - 성공', async () => {

        const result = await getByFolderId(
            new ObjectId(userIdString),
            new ObjectId(folderId1String),
            new ObjectId(postId14String),
        );
        expect(result).toMatchObject({
            pageNumber: 2
        })
    });

    test('포스트 폴더 페이지 번호 얻기 - 실패', async () => {

        const result = await getByFolderId(
            new ObjectId('012345678901234567891234'),
            new ObjectId(folderId1String),
            new ObjectId(postId14String),
        );
        expect(result).toEqual(undefined)
    });
})


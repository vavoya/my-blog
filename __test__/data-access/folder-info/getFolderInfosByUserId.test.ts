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
import getFolderInfosByUserId from "@/data-access/folder-info/getFolderInfosByUserId";

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

describe('폴더 배열 얻기', () => {
    test('폴더 배열 얻기 - 성공', async () => {

        const result = await getFolderInfosByUserId(new ObjectId(userIdString));
        expect(result).toMatchObject(commonFixture.folder_info)
    });

    test('폴더 배열 얻기 - 실패', async () => {

        const result = await getFolderInfosByUserId(new ObjectId('012345678901234567891234'));
        expect(result).toEqual([])
    });
})


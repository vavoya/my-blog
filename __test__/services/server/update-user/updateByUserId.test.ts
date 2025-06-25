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
    lastModifiedString,
    userIdString
} from "@/__test__/_memory/fixtures/common";
import updateByUserId from "@/services/server/update-user/updateByUserId";
import * as updateUserInfo from "@/data-access/user-info/updateUserInfo";

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

describe('유저 정보 수정 검증', () => {
    test('유저 정보 수정 - 성공', async () => {
        const result = await updateByUserId({
            userId: userIdString,
            lastModified: lastModified,
            userName: 'test',
            blogName: 'test',
            agreementsEmail: false
        });

        expect(result).toEqual(expect.objectContaining({
            success: true,
        }));
    })

    test('유저 정보 수정 - lastModified 에러', async () => {
        const result = await updateByUserId({
            userId: userIdString,
            userName: 'test',
            blogName: 'test',
            agreementsEmail: false,
            lastModified: '2022-02-01T00:00:00.000Z',
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'LastModifiedMismatch'
        }));
    });

    test('유저 정보 수정 - userId 에러', async () => {
        const result = await updateByUserId({
            userId: '64e100000000000000000002',
            lastModified: lastModified,
            userName: 'test',
            blogName: 'test',
            agreementsEmail: false
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UserNotFound'
        }));
    });

    test('유저 정보 수정 - 유저 정보 수정 실패', async () => {
        vi.spyOn(updateUserInfo, 'default').mockResolvedValue(null)

        const result = await updateByUserId({
            userId: userIdString,
            lastModified: lastModified,
            userName: 'test',
            blogName: 'test',
            agreementsEmail: false
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'UserNotFound'
        }));
    })

    test('유저 정보 수정 - 트랜잭션 실패', async () => {
        vi.spyOn(getClient(), 'db').mockImplementation(() => {
            throw new Error('강제로 실패시킴');
        })


        const result = await updateByUserId({
            userId: userIdString,
            lastModified: lastModified,
            userName: 'test',
            blogName: 'test',
            agreementsEmail: false
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'TransactionError'
        }));
    })
})


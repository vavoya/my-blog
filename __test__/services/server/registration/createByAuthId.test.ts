import {afterAll, test, expect, vi, describe, beforeEach} from 'vitest';

import {
    setupMemoryMongo,
    getClient,
    getDb,
    teardownMemoryMongo,
} from '@/__test__/_memory/memory-server';

import {loadFixture} from "@/__test__/_memory/load-fixture";
import {
    authId,
    blogUrl,
    commonFixture,
} from "@/__test__/_memory/fixtures/common";
import createByAuthId from "@/services/server/registration/createByAuthId";
import {COLLECTION_BANNED_AUTH_LIST, COLLECTION_SETTINGS} from "@/lib/mongoDB/const";
import * as insertOneUserInfo from "@/data-access/user-info/insertOne";
import {ObjectId} from "mongodb";
import * as insertOneAboutInfo from "@/data-access/about-info/insertOne";
import * as insertOneSeries from "@/data-access/series-info/insertOne";
import * as insertOneFolder from "@/data-access/folder-info/insertOne";

// 1. 정적 mock 선언 (vi.mock)
vi.mock('@/lib/mongoDB/mongoClient', async () => {
    await setupMemoryMongo();
    return {
        client: getClient(),
    };
});

beforeEach(async () => {
    vi.restoreAllMocks();
    await loadFixture(getDb(), commonFixture);
});

afterAll(async () => {
    await teardownMemoryMongo();
});

describe('회원 등록 검증', () => {
    test('회원 등록 - 성공', async () => {
        const result = await createByAuthId({
            authId: 'naver_test_success',
            email: 'test@gmail.com',
            name: '이름',
            blogName: '블로그 이름',
            blogUrl: 'test_success'
        });

        expect(result).toEqual(expect.objectContaining({
            success: true,
        }))
    })

    test('회원 등록 - 1. 등록 차단', async () => {
        await getDb().collection(COLLECTION_SETTINGS).findOneAndUpdate({
            id: 'allow_signup',
        } , {
            $set: {
                value: false,
                updatedAt: new Date()
            }
        });

        const result = await createByAuthId({
            authId: 'naver_test',
            email: 'test@gmail.com',
            name: '이름',
            blogName: '블로그 이름',
            blogUrl: '222'
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'SignupDisabled'
        }));
    })

    test('회원 등록 - 2. 중복 url', async () => {
        const result = await createByAuthId({
            authId: 'naver_test',
            email: 'test@gmail.com',
            name: '이름',
            blogName: '블로그 이름',
            blogUrl: blogUrl
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'BlogAlreadyExists'
        }));
    })

    test('회원 등록 - 3. 차단된 authId', async () => {
        const bannedAuthId = 'naver_banned';
        await getDb().collection(COLLECTION_BANNED_AUTH_LIST).insertOne({
            auth_id: bannedAuthId,
            reason: "그냥 내맘이다",
            banned_at: new Date()
        }, {forceServerObjectId: true});

        const result = await createByAuthId({
            authId: bannedAuthId,
            email: 'test@gmail.com',
            name: '이름',
            blogName: '블로그 이름',
            blogUrl: '222'
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'BannedUser'
        }));
    })

    test('회원 등록 - 4. 이미 등록된 유저', async () => {
        const result = await createByAuthId({
            authId: authId,
            email: 'test@gmail.com',
            name: '이름',
            blogName: '블로그 이름',
            blogUrl: '222'
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'AlreadyRegistered'
        }))
    })

    test('회원 등록 - 5. 유저 정보 생성 실패', async () => {
        vi.spyOn(insertOneUserInfo, 'default').mockResolvedValue({
            acknowledged: false,
            insertedId: new ObjectId()
        })

        const result = await createByAuthId({
            authId: 'naver_test_success',
            email: 'test@gmail.com',
            name: '이름',
            blogName: '블로그 이름',
            blogUrl: 'test_success'
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            error: 'RegistrationFailed'
        }));
    })

    test('회원 등록 - 6-1. 폴더  생성 실패', async () => {
        // folder 생성 실
        vi.spyOn(insertOneFolder, 'default').mockResolvedValue({
            acknowledged: false,
            insertedId: new ObjectId()
        })
        const resultFolder = await createByAuthId({
            authId: 'naver_test_success',
            email: 'test@gmail.com',
            name: '이름',
            blogName: '블로그 이름',
            blogUrl: 'test_success'
        });
        expect(resultFolder).toEqual(expect.objectContaining({
            success: false,
            error: 'RegistrationFailed'
        }));
    })

    test('회원 등록 - 6-2. 시리즈 생성 실패', async () => {
        // sereis 생성 실패
        vi.spyOn(insertOneSeries, 'default').mockResolvedValue({
            acknowledged: false,
            insertedId: new ObjectId()
        })
        const resultSeries = await createByAuthId({
            authId: 'naver_test_success',
            email: 'test@gmail.com',
            name: '이름',
            blogName: '블로그 이름',
            blogUrl: 'test_success'
        });
        expect(resultSeries).toEqual(expect.objectContaining({
            success: false,
            error: 'RegistrationFailed'
        }));
    })

    test('회원 등록 - 6-3. about 생성 실패', async () => {
        // about 생성 실패
        vi.spyOn(insertOneAboutInfo, 'default').mockResolvedValue({
            acknowledged: false,
            insertedId: new ObjectId()
        })
        const resultAbout = await createByAuthId({
            authId: 'naver_test_success',
            email: 'test@gmail.com',
            name: '이름',
            blogName: '블로그 이름',
            blogUrl: 'test_success'
        });
        expect(resultAbout).toEqual(expect.objectContaining({
            success: false,
            error: 'RegistrationFailed'
        }));
    })

    test('회원 등록 - 트랜잭션 실패', async () => {
        vi.spyOn(getClient(), 'db').mockImplementation(() => {
            throw new Error('강제로 실패시킴');
        })

        const resultAbout = await createByAuthId({
            authId: 'naver_test_success',
            email: 'test@gmail.com',
            name: '이름',
            blogName: '블로그 이름',
            blogUrl: 'test_success'
        });
        expect(resultAbout).toEqual(expect.objectContaining({
            success: false,
            error: 'TransactionError'
        }));
    })
})


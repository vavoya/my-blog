import { ObjectId } from 'mongodb';
import { parseBlocks } from 'md-ast-parser';

import {
    COLLECTION_USER,
    COLLECTION_FOLDER,
    COLLECTION_SERIES,
    COLLECTION_ABOUT,
    COLLECTION_POST, COLLECTION_BANNED_AUTH_LIST, COLLECTION_SETTINGS,
} from '@/lib/mongoDB/const';

import { UserInfoDocument } from '@/lib/mongoDB/types/documents/userInfo.type';
import { FolderInfoDocument } from '@/lib/mongoDB/types/documents/folderInfo.type';
import { SeriesInfoDocument } from '@/lib/mongoDB/types/documents/seriesInfo.type';
import { AboutInfoDocument } from '@/lib/mongoDB/types/documents/aboutInfo.type';
import { PostInfoDocument } from '@/lib/mongoDB/types/documents/postInfo.type';
import {BannedAuthListDocument} from "@/lib/mongoDB/types/documents/bannedList.type";
import {SettingsDocument} from "@/lib/mongoDB/types/documents/settings.type";

export const authId = 'naver_7777777';
export const userIdString = '64e100000000000000000001';
export const folderId1String = '64e200000000000000000001';
export const folderId2String = '64e200000000000000000002';
export const seriesIdString = '64e300000000000000000001';
export const postId1String = '64e500000000000000000001';
export const postId14String = '64e500000000000000000014'
export const lastModifiedString = '2022-01-01T00:00:00.000Z'
export const blogUrl = 'ha-ha'

const userId = new ObjectId(userIdString);
const folderId1 = new ObjectId(folderId1String);
const folderId2 = new ObjectId(folderId2String);
const seriesId = new ObjectId(seriesIdString);
const aboutId = new ObjectId('64e400000000000000000001');
const postId1 = new ObjectId(postId1String);
const postId2 = new ObjectId('64e500000000000000000002');
const postId3 = new ObjectId('64e500000000000000000003');
const postId4 = new ObjectId('64e500000000000000000004');
const postId5 = new ObjectId('64e500000000000000000005');
const postId6 = new ObjectId('64e500000000000000000006');
const postId7 = new ObjectId('64e500000000000000000007');
const postId8 = new ObjectId('64e500000000000000000008');
const postId9 = new ObjectId('64e500000000000000000009');
const postId10 = new ObjectId('64e500000000000000000010');
const postId11 = new ObjectId('64e500000000000000000011');
const postId12 = new ObjectId('64e500000000000000000012');
const postId13 = new ObjectId('64e500000000000000000013');
const postId14 = new ObjectId(postId14String);
const settingId1 = new ObjectId('64e600000000000000000001');


type CommonFixture = {
    [COLLECTION_USER]: UserInfoDocument[];
    [COLLECTION_FOLDER]: FolderInfoDocument[];
    [COLLECTION_SERIES]: SeriesInfoDocument[];
    [COLLECTION_ABOUT]: AboutInfoDocument[];
    [COLLECTION_POST]: PostInfoDocument[];
    [COLLECTION_BANNED_AUTH_LIST]: BannedAuthListDocument[];
    [COLLECTION_SETTINGS]: SettingsDocument[];
};

export const commonFixture: CommonFixture = {
    [COLLECTION_USER]: [
        {
            _id: userId,
            auth_id: authId,
            last_modified: new Date(lastModifiedString),
            blog_name: '테스트 블로그',
            user_name: '홍길동',
            email: 'hong@example.com',
            blog_url: `@${blogUrl}`,
            next_post_id: 3,
            registration_state: true,
            is_deleted: false,
            last_login_at: new Date('2024-06-20T10:00:00Z'),
            agreements: {
                terms: true,
                privacy: true,
                email: false,
            },
        },
    ],
    [COLLECTION_FOLDER]: [
        {
            _id: folderId1,
            user_id: userId,
            pfolder_id: null,
            folder_name: '~',
            post_count: 13,
        },
        {
            _id: folderId2,
            user_id: userId,
            pfolder_id: folderId1,
            folder_name: '학습자료',
            post_count: 1,
        },
    ],
    [COLLECTION_SERIES]: [
        {
            _id: seriesId,
            user_id: userId,
            series_name: 'React 마스터',
            series_description: '리액트 입문부터 고급까지',
            post_list: [postId1, postId2],
            createdAt: new Date('2024-01-01T00:00:00Z'),
            updatedAt: new Date(),
        },
    ],
    [COLLECTION_ABOUT]: [
        {
            _id: aboutId,
            user_id: userId,
            content: '이 블로그는 저의 개발 기록입니다.',
            ast: parseBlocks(['이 블로그는 저의 개발 기록입니다.']),
        },
    ],
    [COLLECTION_POST]: [
        {
            _id: postId1,
            user_id: userId,
            post_url: 'react-hooks-1',
            folder_id: folderId1,
            post_name: 'React 훅 완전정복',
            post_createdAt: new Date('2024-01-10T09:00:00Z'),
            post_updatedAt: new Date('2024-01-10T09:00:00Z'),
            post_description: 'useEffect와 useMemo 중심으로 정리',
            post_content: '# useEffect와 useMemo\n차이점 설명',
            post_ast: parseBlocks(['# useEffect와 useMemo', '차이점 설명']),
            thumb_url: '',
            series_id: seriesId,
            viewCount: 50,
            ad_review: {
                reviewed: true,
                suitable: true,
                reviewedAt: new Date('2024-01-12T10:00:00Z'),
                reviewedBy: 'moderator',
            },
        },
        {
            _id: postId2,
            user_id: userId,
            post_url: 'react-suspense-2',
            folder_id: folderId2,
            post_name: 'React Suspense 개념',
            post_createdAt: new Date('2024-02-01T10:00:00Z'),
            post_updatedAt: new Date('2024-02-01T10:00:00Z'),
            post_description: 'Suspense와 lazy에 대한 설명',
            post_content: '# Suspense란?\n지연 렌더링을 지원하는 기능',
            post_ast: parseBlocks(['# Suspense란?', '지연 렌더링을 지원하는 기능']),
            thumb_url: '',
            series_id: seriesId,
            viewCount: 120,
            ad_review: {
                reviewed: false,
                suitable: false,
                reviewedAt: null,
                reviewedBy: '',
            },
        },
        {
            _id: postId3,
            user_id: userId,
            post_url: 'react-hooks-3',
            folder_id: folderId1,
            post_name: 'React 훅 완전정복',
            post_createdAt: new Date('2024-03-10T09:00:00Z'),
            post_updatedAt: new Date('2024-03-10T09:00:00Z'),
            post_description: 'useEffect와 useMemo 중심으로 정리',
            post_content: '# useEffect와 useMemo\n차이점 설명',
            post_ast: parseBlocks(['# useEffect와 useMemo', '차이점 설명']),
            thumb_url: '',
            series_id: seriesId,
            viewCount: 50,
            ad_review: {
                reviewed: true,
                suitable: true,
                reviewedAt: new Date('2024-01-12T10:00:00Z'),
                reviewedBy: 'moderator',
            },
        },
        {
            _id: postId4,
            user_id: userId,
            post_url: 'react-hooks-4',
            folder_id: folderId1,
            post_name: 'React 훅 완전정복',
            post_createdAt: new Date('2024-01-15T09:00:00Z'),
            post_updatedAt: new Date('2024-01-15T09:00:00Z'),
            post_description: 'useEffect와 useMemo 중심으로 정리',
            post_content: '# useEffect와 useMemo\n차이점 설명',
            post_ast: parseBlocks(['# useEffect와 useMemo', '차이점 설명']),
            thumb_url: '',
            series_id: seriesId,
            viewCount: 50,
            ad_review: {
                reviewed: true,
                suitable: true,
                reviewedAt: new Date('2024-01-15T10:00:00Z'),
                reviewedBy: 'moderator',
            },
        },
        {
            _id: postId5,
            user_id: userId,
            post_url: 'react-hooks-5',
            folder_id: folderId1,
            post_name: 'React 훅 완전정복',
            post_createdAt: new Date('2024-03-11T09:00:00Z'),
            post_updatedAt: new Date('2024-03-11T09:00:00Z'),
            post_description: 'useEffect와 useMemo 중심으로 정리',
            post_content: '# useEffect와 useMemo\n차이점 설명',
            post_ast: parseBlocks(['# useEffect와 useMemo', '차이점 설명']),
            thumb_url: '',
            series_id: seriesId,
            viewCount: 50,
            ad_review: {
                reviewed: true,
                suitable: true,
                reviewedAt: new Date('2024-01-19T10:00:00Z'),
                reviewedBy: 'moderator',
            },
        },
        {
            _id: postId6,
            user_id: userId,
            post_url: 'react-hooks-6',
            folder_id: folderId1,
            post_name: 'React 훅 완전정복',
            post_createdAt: new Date('2024-03-04T09:00:00Z'),
            post_updatedAt: new Date('2024-03-04T09:00:00Z'),
            post_description: 'useEffect와 useMemo 중심으로 정리',
            post_content: '# useEffect와 useMemo\n차이점 설명',
            post_ast: parseBlocks(['# useEffect와 useMemo', '차이점 설명']),
            thumb_url: '',
            series_id: seriesId,
            viewCount: 50,
            ad_review: {
                reviewed: true,
                suitable: true,
                reviewedAt: new Date('2024-01-12T10:00:00Z'),
                reviewedBy: 'moderator',
            },
        },
        {
            _id: postId7,
            user_id: userId,
            post_url: 'react-hooks-7',
            folder_id: folderId1,
            post_name: 'React 훅 완전정복',
            post_createdAt: new Date('2024-03-06T09:00:00Z'),
            post_updatedAt: new Date('2024-03-06T09:00:00Z'),
            post_description: 'useEffect와 useMemo 중심으로 정리',
            post_content: '# useEffect와 useMemo\n차이점 설명',
            post_ast: parseBlocks(['# useEffect와 useMemo', '차이점 설명']),
            thumb_url: '',
            series_id: seriesId,
            viewCount: 50,
            ad_review: {
                reviewed: true,
                suitable: true,
                reviewedAt: new Date('2024-01-12T10:00:00Z'),
                reviewedBy: 'moderator',
            },
        },
        {
            _id: postId8,
            user_id: userId,
            post_url: 'react-hooks-8',
            folder_id: folderId1,
            post_name: 'React 훅 완전정복',
            post_createdAt: new Date('2024-01-02T09:00:00Z'),
            post_updatedAt: new Date('2024-01-02T09:00:00Z'),
            post_description: 'useEffect와 useMemo 중심으로 정리',
            post_content: '# useEffect와 useMemo\n차이점 설명',
            post_ast: parseBlocks(['# useEffect와 useMemo', '차이점 설명']),
            thumb_url: '',
            series_id: seriesId,
            viewCount: 50,
            ad_review: {
                reviewed: true,
                suitable: true,
                reviewedAt: new Date('2024-01-12T10:00:00Z'),
                reviewedBy: 'moderator',
            },
        },
        {
            _id: postId9,
            user_id: userId,
            post_url: 'react-hooks-9',
            folder_id: folderId1,
            post_name: 'React 훅 완전정복',
            post_createdAt: new Date('2024-03-01T09:00:00Z'),
            post_updatedAt: new Date('2024-03-01T09:00:00Z'),
            post_description: 'useEffect와 useMemo 중심으로 정리',
            post_content: '# useEffect와 useMemo\n차이점 설명',
            post_ast: parseBlocks(['# useEffect와 useMemo', '차이점 설명']),
            thumb_url: '',
            series_id: seriesId,
            viewCount: 50,
            ad_review: {
                reviewed: true,
                suitable: true,
                reviewedAt: new Date('2024-01-12T10:00:00Z'),
                reviewedBy: 'moderator',
            },
        },
        {
            _id: postId10,
            user_id: userId,
            post_url: 'react-hooks-10',
            folder_id: folderId1,
            post_name: 'React 훅 완전정복',
            post_createdAt: new Date('2024-04-05T09:00:00Z'),
            post_updatedAt: new Date('2024-04-05T09:00:00Z'),
            post_description: 'useEffect와 useMemo 중심으로 정리',
            post_content: '# useEffect와 useMemo\n차이점 설명',
            post_ast: parseBlocks(['# useEffect와 useMemo', '차이점 설명']),
            thumb_url: '',
            series_id: seriesId,
            viewCount: 50,
            ad_review: {
                reviewed: true,
                suitable: true,
                reviewedAt: new Date('2024-01-12T10:00:00Z'),
                reviewedBy: 'moderator',
            },
        },
        {
            _id: postId11,
            user_id: userId,
            post_url: 'react-hooks-11',
            folder_id: folderId1,
            post_name: 'React 훅 완전정복',
            post_createdAt: new Date('2023-01-10T09:00:00Z'),
            post_updatedAt: new Date('2023-01-10T09:00:00Z'),
            post_description: 'useEffect와 useMemo 중심으로 정리',
            post_content: '# useEffect와 useMemo\n차이점 설명',
            post_ast: parseBlocks(['# useEffect와 useMemo', '차이점 설명']),
            thumb_url: '',
            series_id: seriesId,
            viewCount: 50,
            ad_review: {
                reviewed: true,
                suitable: true,
                reviewedAt: new Date('2024-01-12T10:00:00Z'),
                reviewedBy: 'moderator',
            },
        },
        {
            _id: postId12,
            user_id: userId,
            post_url: 'react-hooks-12',
            folder_id: folderId1,
            post_name: 'React 훅 완전정복',
            post_createdAt: new Date('2022-01-10T09:00:00Z'),
            post_updatedAt: new Date('2022-01-10T09:00:00Z'),
            post_description: 'useEffect와 useMemo 중심으로 정리',
            post_content: '# useEffect와 useMemo\n차이점 설명',
            post_ast: parseBlocks(['# useEffect와 useMemo', '차이점 설명']),
            thumb_url: '',
            series_id: seriesId,
            viewCount: 50,
            ad_review: {
                reviewed: true,
                suitable: true,
                reviewedAt: new Date('2024-01-12T10:00:00Z'),
                reviewedBy: 'moderator',
            },
        },
        {
            _id: postId13,
            user_id: userId,
            post_url: 'react-hooks-13',
            folder_id: folderId1,
            post_name: 'React 훅 완전정복',
            post_createdAt: new Date('2021-01-10T09:00:00Z'),
            post_updatedAt: new Date('2021-01-10T09:00:00Z'),
            post_description: 'useEffect와 useMemo 중심으로 정리',
            post_content: '# useEffect와 useMemo\n차이점 설명',
            post_ast: parseBlocks(['# useEffect와 useMemo', '차이점 설명']),
            thumb_url: '',
            series_id: seriesId,
            viewCount: 50,
            ad_review: {
                reviewed: true,
                suitable: true,
                reviewedAt: new Date('2024-01-12T10:00:00Z'),
                reviewedBy: 'moderator',
            },
        },
        {
            _id: postId14,
            user_id: userId,
            post_url: 'react-hooks-14',
            folder_id: folderId1,
            post_name: 'React 훅 완전정복',
            post_createdAt: new Date('2002-01-10T09:00:00Z'),
            post_updatedAt: new Date('2002-01-10T09:00:00Z'),
            post_description: 'useEffect와 useMemo 중심으로 정리',
            post_content: '# useEffect와 useMemo\n차이점 설명',
            post_ast: parseBlocks(['# useEffect와 useMemo', '차이점 설명']),
            thumb_url: '',
            series_id: seriesId,
            viewCount: 50,
            ad_review: {
                reviewed: true,
                suitable: true,
                reviewedAt: new Date('2024-01-12T10:00:00Z'),
                reviewedBy: 'moderator',
            },
        },
    ],
    [COLLECTION_SETTINGS]: [
        {
            _id: new ObjectId(settingId1),
            id: 'allow_signup',
            value: true,
            updated_at: new Date()
        }
    ],
    [COLLECTION_BANNED_AUTH_LIST]: [],
};

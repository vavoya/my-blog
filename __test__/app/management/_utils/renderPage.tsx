import {render} from "@testing-library/react";

import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import Background from "@/app/management/_components/Background";

const userId = 'userId';
const authId = 'test_authId';
const blogName = 'test_blogName';
const userName = 'test_userName';
const email = 'test_email';
const blogUrl = 'test_blogUrl';
const nextPostId = 0;
const registrationState = false;
const lastModified = '';
const isDeleted = false;
const lastLoginAt = '';
const agreements = {
    terms: false,
    privacy: false,
    email: false
}

const userInfo: UserInfoResponse = {
    _id: userId,
    auth_id: authId,
    blog_name: blogName,
    user_name: userName,
    email: email,
    blog_url: blogUrl,
    next_post_id: nextPostId,
    registration_state: registrationState,
    last_modified: lastModified,
    is_deleted: isDeleted,
    last_login_at: lastLoginAt,
    agreements: {
        terms: agreements.terms,
        privacy: agreements.privacy,
        email: agreements.email
    }
}
const folderInfos: FolderInfoResponse[] = [
    {
        _id: '1',
        user_id: userId,
        folder_name: '~',
        pfolder_id: null,
        post_count: 0,
    },
    {
        _id: '2',
        user_id: userId,
        folder_name: 'Documents',
        pfolder_id: '1',
        post_count: 2
    },
    {
        _id: '3',
        user_id: userId,
        folder_name: 'Projects',
        pfolder_id: '1',
        post_count: 3
    },
    {
        _id: '4',
        user_id: userId,
        folder_name: 'Images',
        pfolder_id: '1',
        post_count: 1
    },
    {
        _id: '5',
        user_id: userId,
        folder_name: 'Work',
        pfolder_id: '2',
        post_count: 4
    },
    {
        _id: '6',
        user_id: userId,
        folder_name: 'Personal',
        pfolder_id: '2',
        post_count: 2
    },
    {
        _id: '7',
        user_id: userId,
        folder_name: 'React',
        pfolder_id: '3',
        post_count: 5
    },
    {
        _id: '8',
        user_id: userId,
        folder_name: 'Node',
        pfolder_id: '3',
        post_count: 3
    },
    {
        _id: '9',
        user_id: userId,
        folder_name: 'Photos',
        pfolder_id: '4',
        post_count: 10
    },
    {
        _id: '10',
        user_id: userId,
        folder_name: 'Screenshots',
        pfolder_id: '4',
        post_count: 6
    }
] as const
const seriesInfos: SeriesInfoResponse[] = [
    {
        _id: '1',
        user_id: userId,
        series_name: 'seriesName',
        series_description: 'sss',
        post_list: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
        _id: '2',
        user_id: userId,
        series_name: 'React Tutorial',
        series_description: 'Learn React step by step',
        post_list: [],
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z'
    },
    {
        _id: '3',
        user_id: userId,
        series_name: 'Node.js Basics',
        series_description: 'Node.js fundamentals',
        post_list: [],
        createdAt: '2024-01-03T00:00:00.000Z',
        updatedAt: '2024-01-03T00:00:00.000Z'
    },
    {
        _id: '4',
        user_id: userId,
        series_name: 'TypeScript Guide',
        series_description: 'TypeScript programming guide',
        post_list: [],
        createdAt: '2024-01-04T00:00:00.000Z',
        updatedAt: '2024-01-04T00:00:00.000Z'
    },
    {
        _id: '5',
        user_id: userId,
        series_name: 'Web Development',
        series_description: 'Modern web development series',
        post_list: [],
        createdAt: '2024-01-05T00:00:00.000Z',
        updatedAt: '2024-01-05T00:00:00.000Z'
    }
] as const

export {
    userInfo,
    folderInfos,
    seriesInfos,
}

export function renderPage() {

    return render(
        <Background userInfo={userInfo} folderInfo={folderInfos} seriesInfo={seriesInfos}/>
    )
}
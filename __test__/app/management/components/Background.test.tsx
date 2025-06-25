import {describe, expect, test} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import Background from "@/app/management/_components/Background";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";

const userInfo: UserInfoResponse = {
    _id: "1",
    agreements: {email: false, privacy: false, terms: false},
    auth_id: "test_1",
    blog_name: "blogName",
    blog_url: "blog-url",
    email: "email",
    is_deleted: false,
    last_login_at: "",
    last_modified: "",
    next_post_id: 0,
    registration_state: false,
    user_name: "userName"

}
const folderInfo:FolderInfoResponse[] = [
    {
        _id: '1',
        user_id: userInfo._id,
        folder_name: '~',
        pfolder_id: null,
        post_count: 0,
    }
]
const seriesInfo: SeriesInfoResponse[] = [
    {
        _id: "1",
        user_id: userInfo._id,
        series_name: "seriesName",
        series_description: "sss",
        post_list: [],
        createdAt: "",
        updatedAt: ""
    }
]

describe('Background', () => {
    describe('윈도우 생성 테스트', () => {
        test('폴더 윈도우', () => {
            render(
                <Background userInfo={userInfo} folderInfo={folderInfo} seriesInfo={seriesInfo} />
            )

            fireEvent.click(screen.getByText('폴더 편집'))
            expect(screen.getByText('폴더 트리')).toBeInTheDocument()
        })

        test('시리즈 윈도우', () => {
            render(
                <Background userInfo={userInfo} folderInfo={folderInfo} seriesInfo={seriesInfo} />
            )

            fireEvent.click(screen.getByText('시리즈 편집'))
            expect(screen.getByText('시리즈 목록')).toBeInTheDocument()
        })

        test('설정 윈도우', () => {
            render(
                <Background userInfo={userInfo} folderInfo={folderInfo} seriesInfo={seriesInfo} />
            )

            expect(screen.getAllByText('설정')[1] ?? null).not.toBeInTheDocument()
            fireEvent.click(screen.getAllByText('설정')[0])
            expect(screen.getAllByText('설정')[1]).toBeInTheDocument()
        })

        test('글쓰기 윈도우', () => {
            render(
                <Background userInfo={userInfo} folderInfo={folderInfo} seriesInfo={seriesInfo} />
            )

            expect(screen.queryByText('새 포스트 작성') ?? null).not.toBeInTheDocument()
            fireEvent.click(screen.getByText('글쓰기'))
            expect(screen.getByText('새 포스트 작성')).toBeInTheDocument()
        })

        test('소개글 윈도우', () => {
            render(
                <Background userInfo={userInfo} folderInfo={folderInfo} seriesInfo={seriesInfo} />
            )

            expect(screen.queryByText('소개글 수정') ?? null).not.toBeInTheDocument()
            fireEvent.click(screen.getByText('소개글'))
            expect(screen.getByText('소개글 수정')).toBeInTheDocument()
        })
    })

    describe('토스트 생성 테스트', () => {
        test('통계 토스트', () => {
            render(
                <Background userInfo={userInfo} folderInfo={folderInfo} seriesInfo={seriesInfo} />
            )

            fireEvent.click(screen.getByText('통계'))
            expect(screen.getByText('vavoya6324@gmail.com로 문의주시면 제공해드리곘습니다.')).toBeInTheDocument()
        })
    })
})
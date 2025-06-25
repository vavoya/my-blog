import {describe, expect, test, vi} from "vitest";
import {folderInfos, renderPage} from "@/__test__/app/management/_utils/renderPage";
import {fireEvent, screen, waitFor, within} from "@testing-library/react";
import treeBranchStyles from "@/app/management/_window/folder/TreeBranch/treeBranch.module.scss";
import optionModalStyles from "@/app/management/_window/folder/components/folderOptionModal.module.scss";
import modalStyles from "@/app/management/_window/folder/components/modal.module.scss";

// 서버 통신
import * as patchBySession from "@/fetch/client/folders/patchBySession";
import * as deleteBySession from "@/fetch/client/folders/deleteBySession";
import * as postBySession from "@/fetch/client/folders/postBySession";
import {selectSearchFolder} from "@/__test__/app/management/components/search-folder/SearchFolder.test";
import {toObj} from "@/components/modal/utils/toObj";


describe('폴더 페이지 동작 테스트', () => {
    describe('옵션 모달 띄우기', () => {
        test("루트 폴더", () => {
            renderPage();
            fireEvent.click(screen.getByText('폴더 편집'))

            const rootFolderItem = document.getElementsByClassName(treeBranchStyles.folderOptionButton)[0];
            fireEvent.click(rootFolderItem);
            const optionModal = document.getElementsByClassName(optionModalStyles.modal)[0];
            expect(optionModal).toBeInTheDocument()
            expect(optionModal).toHaveTextContent('하위 폴더 생성')
            expect(optionModal).not.toHaveTextContent('폴더 이름 변경')
            expect(optionModal).not.toHaveTextContent('폴더 삭제')
            expect(optionModal).not.toHaveTextContent('폴더 이동')
        })

        test("하위 폴더 (동시에 루트 폴더 옵션 모달 닫히는 것도)", () => {
            renderPage();
            fireEvent.click(screen.getByText('폴더 편집'))

            const elements = [...document.getElementsByClassName(treeBranchStyles.folderOptionButton)]
            elements.forEach((element, index) => {
                // 루트 폴더는 검사 X
                if (index === 0) return;

                fireEvent.click(element);
                const optionModal = document.getElementsByClassName(optionModalStyles.modal)[0];
                expect(optionModal).toBeInTheDocument()
                expect(optionModal).toHaveTextContent('하위 폴더 생성')
                expect(optionModal).toHaveTextContent('폴더 이름 변경')
                expect(optionModal).toHaveTextContent('폴더 삭제')
                expect(optionModal).toHaveTextContent('폴더 이동')
            })
        })
    })

    describe('옵션 모달 클릭후 렌더링 테스트', () => {
        test('하위 폴더 생성 클릭', () => {
            renderPage();
            fireEvent.click(screen.getByText('폴더 편집'))

            const element = document.getElementsByClassName(treeBranchStyles.folderOptionButton)[1];
            fireEvent.click(element);
            fireEvent.click(screen.getByText('하위 폴더 생성'));
            expect(document.getElementsByClassName(modalStyles.modal)[0]).toHaveTextContent('하위 폴더 생성')
        })

        test('폴더 이름 변경 클릭', () => {
            renderPage();
            fireEvent.click(screen.getByText('폴더 편집'))

            const element = document.getElementsByClassName(treeBranchStyles.folderOptionButton)[1];
            fireEvent.click(element);
            fireEvent.click(screen.getByText('폴더 이름 변경'));
            expect(document.getElementsByClassName(modalStyles.modal)[0]).toHaveTextContent('폴더 이름 변경')
        })

        test('폴더 이동 클릭', () => {
            renderPage();
            fireEvent.click(screen.getByText('폴더 편집'))

            const element = document.getElementsByClassName(treeBranchStyles.folderOptionButton)[1];
            fireEvent.click(element);
            fireEvent.click(screen.getByText('폴더 이동'));
            expect(document.getElementsByClassName(modalStyles.modal)[0]).toHaveTextContent('폴더 이동')
        })

        test('폴더 삭제 클릭', () => {
            renderPage();
            fireEvent.click(screen.getByText('폴더 편집'))

            const element = document.getElementsByClassName(treeBranchStyles.folderOptionButton)[1];
            fireEvent.click(element);
            fireEvent.click(screen.getByText('폴더 삭제'));
            expect(document.getElementsByClassName(modalStyles.modal)[0]).toHaveTextContent('폴더 삭제')
        })
    })

    describe('클라 <-> 서버 통신 결과 테스트(fetch 모킹)', () => {
        vi.spyOn(patchBySession, 'default').mockResolvedValue({
            status: 200,
            data: {
                lastModified: new Date().toISOString(),
            }
        })
        vi.spyOn(deleteBySession, 'default').mockResolvedValue({
            status: 200,
            data: {
                lastModified: new Date().toISOString(),
            }
        })

        vi.spyOn(postBySession, 'default').mockResolvedValue({
            status: 200,
            data: {
                lastModified: new Date().toISOString(),
                folderId: 'test_new_folder_id'
            }
        })

        test('하위 폴더 생성', async () => {
            renderPage();
            fireEvent.click(screen.getByText('폴더 편집'))

            const element = document.getElementsByClassName(treeBranchStyles.folderOptionButton)[1];
            fireEvent.click(element);
            fireEvent.click(screen.getByText('하위 폴더 생성'));

            // 새 폴더 이름 입력
            const newFolderName = 'test_new_folder_name';
            const input = screen.getByPlaceholderText('새 폴더')
            fireEvent.change(input, { target: { value: newFolderName } })
            // 클릭
            fireEvent.click(screen.getByText('생성'))
            const newFolder = await screen.findByText(newFolderName);
            expect(newFolder).toBeInTheDocument()
        })

        test('폴더 이동', async () => {
            renderPage();
            fireEvent.click(screen.getByText('폴더 편집'))

            const currentFolder = folderInfos.find(folderInfo => folderInfo._id === '5')!;
            const targetFolder = folderInfos.find(folderInfo => folderInfo._id === '3')!;

            const element = within(document.getElementById(currentFolder._id)!).getByText('⋮');
            fireEvent.click(element);
            fireEvent.click(screen.getByText('폴더 이동'));

            // 이동 폴더 선택
            const folderObj = toObj(folderInfos);
            selectSearchFolder(targetFolder!.folder_name!, folderObj);

            // 클릭
            fireEvent.click(screen.getByText('이동'))

            const el = await within(document.getElementById(targetFolder._id)!).findByText(currentFolder.folder_name)
            expect(el).toBeInTheDocument()
        })

        test('폴더 삭제', async () => {
            renderPage();
            fireEvent.click(screen.getByText('폴더 편집'))

            const currentFolder = folderInfos.find(folderInfo => folderInfo._id === '5')!;

            // 폴더 삭제 모달 열기
            const element = within(document.getElementById(currentFolder._id)!).getByText('⋮');
            fireEvent.click(element);
            fireEvent.click(screen.getByText('폴더 삭제'));

            // 여기까지는 폴더가 존재하는지
            expect(document.getElementById(currentFolder._id)!).toBeInTheDocument()

            // 클릭
            fireEvent.click(screen.getByText('삭제'))

            await waitFor(() => {
                expect(document.getElementById(currentFolder._id)!).not.toBeInTheDocument()
            })


        })

        test('폴더 이름 변경', async () => {
            renderPage();
            fireEvent.click(screen.getByText('폴더 편집'))

            const currentFolder = folderInfos.find(folderInfo => folderInfo._id === '5')!;

            // 폴더 이름 변경 모달 열기
            const element = within(document.getElementById(currentFolder._id)!).getByText('⋮');
            fireEvent.click(element);
            fireEvent.click(screen.getByText('폴더 이름 변경'));

            // 폴더 이름 입력
            const newFolderName = 'test_new_folder_name';
            const input = screen.getByPlaceholderText(currentFolder.folder_name)
            fireEvent.change(input, { target: { value: newFolderName } })

            fireEvent.click(screen.getByText('저장'))

            const renameFolder = await within(document.getElementById(currentFolder._id)!).findByText(newFolderName);
            expect(renameFolder).toBeInTheDocument()
        })
    })

    describe('폴더 변경에 따른 폴더 윈도우 변화 검증', () => {
        test('폴더 삭제 시, 열린 윈도우 닫힘', async () => {
            renderPage();
            fireEvent.click(screen.getByText('폴더 편집'))

            const currentFolder = folderInfos.find(folderInfo => folderInfo._id === '5')!;

            // 폴더 열기
            fireEvent.click(screen.getByText(currentFolder.folder_name));

            // 폴더 삭제 모달 열기
            const element = within(document.getElementById(currentFolder._id)!).getByText('⋮');
            fireEvent.click(element);
            fireEvent.click(screen.getByText('폴더 삭제'));

            // 윈도우 유지 여부 검증
            expect(document.getElementById(`PostListWindow-${currentFolder._id}`)).toBeInTheDocument()

            // 클릭
            fireEvent.click(screen.getByText('삭제'))

            // 해당 윈도우 제거 확인
            await waitFor(() => {
                expect(document.getElementById(`PostListWindow-${currentFolder._id}`)).not.toBeInTheDocument()
            })
        })

        test('폴더 이름 변경 시, 열린 윈도우 이름 변경', async () => {
            renderPage();
            fireEvent.click(screen.getByText('폴더 편집'))

            const currentFolder = folderInfos.find(folderInfo => folderInfo._id === '5')!;

            // 폴더 열기
            fireEvent.click(screen.getByText(currentFolder.folder_name));

            // 포스트 목록 윈도우 열림 확인
            expect(document.getElementById(`PostListWindow-${currentFolder._id}`)).toHaveTextContent(currentFolder.folder_name)

            // 폴더 이름 변경 모달 열기
            const element = within(document.getElementById(currentFolder._id)!).getByText('⋮');
            fireEvent.click(element);
            fireEvent.click(screen.getByText('폴더 이름 변경'));

            // 이름 변경
            const newFolderName = 'test_new_folder_name';
            const input = screen.getByPlaceholderText(currentFolder.folder_name)
            fireEvent.change(input, { target: { value: newFolderName } })
            fireEvent.click(screen.getByText('저장'))

            // 윈도우 이름 확인
            const el = await within(document.getElementById(`PostListWindow-${currentFolder._id}`)!).findByText(newFolderName);
            expect(el).toBeInTheDocument()
        })
    })
})
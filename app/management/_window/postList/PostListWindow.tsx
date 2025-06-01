import styles from "./postListWindow.module.css"
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {useEffect, useRef} from "react";
import TableHeader from "@/app/management/_window/postList/components/TableHeader";
import {PaginatedPostsResponse} from "@/models/post_info/types";
import {LIMIT} from "@/const/page";
import TableBody from "@/app/management/_window/postList/components/TableBody";
import {usePaginatedPostsQuery} from "@/app/management/_queries/usePaginatedPostsQuery";
import {useManagementStore} from "@/store/ManagementProvider";
import {WindowObj} from "@/app/management/_window/provider/types";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {FolderObj} from "@/components/modal/utils/toObj";
import {WindowCommandBuilder} from "@/app/management/_window/provider/utils/windowCommands";

type PostListWindowProps = {
    folderId: FolderInfoResponse['_id'];
    windowObj: WindowObj;
}
export default function PostListWindow({folderId, windowObj}: PostListWindowProps) {
    const userInfo = useManagementStore((state) => state.userInfo);
    const folderObj = useManagementStore((state) => state.folderObj);
    const setWindows = useManagementStore((state) => state.setWindows);
    const folder = folderObj[folderId];

    // 윈도우 닫기
    useEffect(() => {
        if (!folder) {
            const commands = (new WindowCommandBuilder()).remove([windowObj.id]).returnCommand()
            setWindows(commands)
        }
    }, [folder, setWindows, windowObj.id]);

    // 윈도우 이름 변경
    useEffect(() => {
        if (folder) {
            const commands = (new WindowCommandBuilder()).rename({[windowObj.id]: folder.folder_name}).returnCommand()
            setWindows(commands)
        }
    }, [folder, folderObj, setWindows, windowObj.id]);

    // 폴더 상태 업데이트 후 폴더가 있는 경우에만 렌더링 시작
    if (folder) {
        return <PostListSection folderObj={folderObj} userInfo={userInfo} folderId={folderId}/>
    } else {
        return null
    }
}

type PostListSectionProps = {
    folderId: FolderInfoResponse['_id'];
    userInfo: UserInfoResponse;
    folderObj: FolderObj;
}
function PostListSection({folderId, userInfo, folderObj}: PostListSectionProps) {
    const maxPage = Math.ceil(folderObj[folderId].post_count / LIMIT)
    const { data, isFetching, fetchNextPage, hasNextPage, } = usePaginatedPostsQuery(userInfo._id, folderId, maxPage)
    const intersectionRoot = useRef<HTMLDivElement>(null);
    const intersectionTarget = useRef<HTMLDivElement>(null);
    const hasNext =  isFetching || hasNextPage // 페이지 불러오고 있거나(초기 fetch), 다음 페이지가 존재하면 로딩바 생성
    const pages = (data?.pages ?? []).reduce((acc: PaginatedPostsResponse[], cur) => {
        if (cur.status === 200) {
            acc.push(...cur.data)
        }
        return acc;
    }, [])
    const lastPage = data?.pages[data?.pages.length - 1];
    const isError = !!lastPage && lastPage.status !== 200;
    const errorMessage = isError ? lastPage.message : undefined;
    const memo = useRef({
        isFetching,
        isError,
        hasNext,
    });
    memo.current.hasNext = hasNext;
    memo.current.isFetching = isFetching;
    memo.current.isError = isError;

    useEffect(() => {
        if (!intersectionTarget.current || !intersectionRoot.current) return; // 이거 의미가 있나. 마운트 되고 등록되고 실행 될껀데 콜백이

        const observer = new IntersectionObserver(
            async (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    // 로딩 중이거나 마지막 응답이 에러이면 중단
                    if (memo.current.isFetching || memo.current.isError) return;
                    await fetchNextPage();
                }
            },
            {
                root: intersectionRoot.current,
                threshold: 0.1, // 10% 이상 보여야 true
            }
        );

        observer.observe(intersectionTarget.current);

        return () => {
            observer.disconnect();
        };
    }, [fetchNextPage]);

    return (
        <div ref={intersectionRoot} role='table' className={styles.postListWindow}>
            <TableHeader />
            <TableBody folderId={folderId}
                       pages={pages}
                       hasNext={hasNext}
                       isError={isError}
                       errorMessage={errorMessage}
                       intersectionTarget={intersectionTarget}/>
        </div>
    )
}

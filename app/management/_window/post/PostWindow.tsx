import PostContent from "@/app/management/_window/post/components/PostContent";
import {PaginatedPostsResponse} from "@/models/post_info/types";
import {usePostQuery} from "@/app/management/_queries/usePostQuery";
import LoadingPost from "@/app/management/_window/post/components/LoadingPost";
import {useEffect, useState} from "react";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";
import {useManagementStore} from "@/store/ManagementProvider";
import PostMeta from "@/app/management/_window/post/components/PostMeta";
import {FetchPost, OnPrevStep} from "@/app/management/_window/post/NewPostWindow";
import useAsyncTaskManager from "@/hook/useAsyncTaskManager";
import {validatePost} from "@/validation/client/post/validatePost";
import {createDeletePostAsyncTask} from "@/app/management/_window/post/handlers/createDeletePostAsyncTask";
import {createUpdatePostAsyncTask} from "@/app/management/_window/post/handlers/createUpdatePostAsyncTask";

export type OnDanger = () => void;
export type PostState = {
    status: "fetching";
    data: undefined;
} | {
    status: "error";
    message: string;
} | {
    status: "success";
    data: PostInfoResponse;
}
export type OnNextStep = (name: PostInfoResponse['post_name'], content: PostInfoResponse['post_content']) => void;
type PostWindowProps = {
    paginatedPost: PaginatedPostsResponse;
}
export default function PostWindow({paginatedPost}: PostWindowProps) {
    const asyncTaskManager = useAsyncTaskManager();
    const userInfo = useManagementStore((state) => state.userInfo);
    const folderObj = useManagementStore((state) => state.folderObj);
    const setFolderObj = useManagementStore((state) => state.setFolderObj);
    const { data } = usePostQuery(userInfo._id, paginatedPost.post_url)
    const [lastStep, setLastStep] = useState(false);
    const [postState, setPostState] = useState<PostState>({
        status: "fetching",
        data: undefined,
    });

    // 포스트 가져온거 판단
    useEffect(() => {
        if (data) {
            if (data.status === 200) {
                setPostState({
                    status: "success",
                    data: data.data,
                })
            } else {
                setPostState({
                    status: "error",
                    message: data.message
                })
            }
        } else {
            setPostState({
                status: "fetching",
                data: undefined,
            })
        }
    }, [data]);

    // 리액트 쿼리의 콜백함수 내에서 에러를 전부 처리하기 때문에, fetching 이후는 undefined 가 나오지 않는다.
    if (postState.status === "fetching") return <LoadingPost />;
    if (postState.status === 'error') return <div><span>{postState.message}</span></div>;


    const onNextStep: OnNextStep = (name: PostInfoResponse['post_name'], content: PostInfoResponse['post_content']) => {
        setPostState({
            status: postState.status,
            data: {
                ...postState.data,
                post_name: name,
                post_content: content,
            }
        })
        setLastStep(true)
    }

    const onPrevStep: OnPrevStep = (thumb, folderId, description) => {
        setPostState({
            status: postState.status,
            data: {
                ...postState.data,
                thumb_url: thumb,
                folder_id: folderId,
                post_description: description,
            }
        })
        setLastStep(false)
    }

    const fetchPost: FetchPost = (thumbnail, folderId, description) => {
        const validationResult = validatePost(postState.data.post_name, postState.data.post_content, folderId);
        if (!validationResult.isValid) {
            return false;
        }

        asyncTaskManager.addAsyncTask(createUpdatePostAsyncTask(
            {
                userId: userInfo._id,
                postId: postState.data._id,
                folderId: folderId,
                currentFolderId: postState.data.folder_id,
                name: postState.data.post_name,
                content: postState.data.post_content,
                description: description,
                thumbnail: thumbnail,
                lastModified: userInfo.last_modified
            },
            {
                folderObj,
                setFolderObj,
            }
        ));
    }

    const onDanger: OnDanger = () => {
        asyncTaskManager.addAsyncTask(createDeletePostAsyncTask(
            {
                userId: userInfo._id,
                postId: postState.data._id,
                name: postState.data.post_name,
                folderId: postState.data.folder_id,
                lastModified: userInfo.last_modified
            },
            {
                folderObj,
                setFolderObj,
            }
        ));
    }

    if (!lastStep) return <PostContent postName={postState.data.post_name} postContent={postState.data.post_content} onNextStep={onNextStep} onDanger={onDanger}/>;
    return <PostMeta isCreating={false} thumb={postState.data.thumb_url} folderId={postState.data.folder_id} description={postState.data.post_description} onPrevStep={onPrevStep} fetchPost={fetchPost} onDanger={onDanger}/>;
}
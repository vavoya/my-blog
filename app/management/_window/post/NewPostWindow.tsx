import PostContent from "@/app/management/_window/post/components/PostContent";
import {useState} from "react";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";
import {useManagementStore} from "@/store/ManagementProvider";
import PostMeta from "@/app/management/_window/post/components/PostMeta";
import useAsyncTaskManager from "@/hook/useAsyncTaskManager";
import {validatePost} from "@/validation/client/post/validatePost";
import {createAddPostAsyncTask} from "@/app/management/_window/post/handlers/createAddPostAsyncTask";


export type OnNextStep = (name: PostInfoResponse['post_name'], content: PostInfoResponse['post_content']) => void;
export type OnPrevStep = (thumb: PostInfoResponse['thumb_url'], folderId: PostInfoResponse['folder_id'], description: PostInfoResponse['post_description']) => void;
export type FetchPost = (thumbnail: PostInfoResponse['thumb_url'], folderId: PostInfoResponse['folder_id'], description: PostInfoResponse['post_description']) => void;
export default function NewPostWindow() {
    const asyncTaskManager = useAsyncTaskManager();
    const userInfo = useManagementStore((state) => state.userInfo);
    const folderObj = useManagementStore((state) => state.folderObj);
    const setFolderObj = useManagementStore((state) => state.setFolderObj);
    const [lastStep, setLastStep] = useState(false);
    const [postState, setPostState] = useState<{postName: PostInfoResponse['post_name'], postContent: PostInfoResponse['post_content']}>({
        postName: "",
        postContent: "",
    });
    const [postMetaState, setPostMetaState] = useState<{thumb: PostInfoResponse['thumb_url'], folderId: PostInfoResponse['folder_id'], description: PostInfoResponse['post_description']}>({
        thumb: "",
        folderId: "",
        description: "",
    });

    const onNextStep: OnNextStep = (name: PostInfoResponse['post_name'], content: PostInfoResponse['post_content']) => {
        setPostState({
            postName: name,
            postContent: content,
        })
        setLastStep(true)
    }

    const onPrevStep: OnPrevStep = (thumb, folderId, description) => {
        setPostMetaState({
            thumb,
            folderId,
            description
        })
        setLastStep(false)
    }

    const fetchPost: FetchPost = (thumbnail, folderId, description) => {
        const validationResult = validatePost(postState.postName, postState.postContent, folderId);
        if (!validationResult.isValid) {
            return false;
        }

        asyncTaskManager.addAsyncTask(createAddPostAsyncTask(
            {
                userId: userInfo._id,
                folderId: folderId,
                name: postState.postName,
                content: postState.postContent,
                description: description,
                thumbnail: thumbnail,
                lastModified: userInfo.last_modified,
            },
            {
                folderObj,
                setFolderObj,
            }
        ));
    }


    if (!lastStep) return <PostContent postName={postState.postName}
                                       postContent={postState.postContent}
                                       onNextStep={onNextStep} />;
    return <PostMeta isCreating={true}
                     thumb={postMetaState.thumb}
                     folderId={postMetaState.folderId}
                     description={postMetaState.description}
                     onPrevStep={onPrevStep}
                     fetchPost={fetchPost}/>;
}
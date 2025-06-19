import SearchFolder, {SelectFolder} from "@/app/management/_components/search-folder/SearchFolder";
import {useState} from "react";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {useManagementStore} from "@/store/ManagementProvider";
import {POST_DESCRIPTION_LIMIT} from "@/const/post";
import Button from "@/app/management/_window/post/components/Button";
import styles from "./postMeta.module.scss"
import Img from "@/components/img/Img";
import {FetchPost, OnPrevStep} from "@/app/management/_window/post/NewPostWindow";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";
import {OnDanger} from "@/app/management/_window/post/PostWindow";
import InputBox from "@/app/management/_components/input-box/InputBox";

type PostMetaProps = {
    thumb: PostInfoResponse['thumb_url'];
    folderId: PostInfoResponse['folder_id'];
    description: PostInfoResponse['post_description'];
    onPrevStep: OnPrevStep;
    onDanger?: OnDanger;
    fetchPost: FetchPost;
    isCreating: boolean;
}
export default function PostMeta({thumb, folderId, description: d, onPrevStep, onDanger, fetchPost, isCreating}: PostMetaProps) {
    const [ selectedFolderId, setSelectedFolderId ] = useState<FolderInfoResponse['_id']>(folderId);
    const [thumbnail, setThumbnail] = useState(thumb);
    const [description, setDescription] = useState(d);
    const trie = useManagementStore((state) => state.trie);
    const folderObj = useManagementStore((state) => state.folderObj);


    const selectFolder: SelectFolder = (folder) => {
        setSelectedFolderId(folder._id);
    }

    return (
        <div className={styles.container}>
            <div className={styles.scroll}>
                <div className={styles.thumbnailSection}>
                    <InputBox title={"대표 이미지 URL"}
                              placeholder={"포스트 대표 이미지 url을 적어주새요"}
                              defaultValue={thumbnail}
                              onBlur={(value) => setThumbnail(value)}/>
                    <div className={styles.thumbnail}>
                        <Img src={thumbnail} />
                    </div>
                </div>
                <InputBox title={'*폴더 경로'}>
                    <SearchFolder selectFolder={selectFolder}
                                  folderObj={folderObj}
                                  trie={trie}
                                  initFolderId={selectedFolderId}
                                  classNames={{
                                      input: styles.inputText,
                                      listBoxRoot: styles.listBoxRoot,
                                      listBox: styles.listBox,
                                      list: styles.list,
                                      text: styles.inputText
                                  }}
                                  placeholder={"폴더 이름을 적어보세요."}/>
                </InputBox>
                <InputBox title={"포스트 설명"}
                          placeholder={"포스트에 대한 간략한 설명을 적어주세요"}
                          defaultValue={description}
                          onChange={(value) => setDescription(value)}
                          maxLength={POST_DESCRIPTION_LIMIT}/>
            </div>
            <Button primary={{text: isCreating ? "생성" : "저장", onClick: () => fetchPost(thumbnail, selectedFolderId, description)}} secondary={{text: "이전", onClick: () => onPrevStep(thumbnail, selectedFolderId, description)}} danger={onDanger ? {text: "삭제", onClick: onDanger} : undefined}/>
        </div>
    )
}
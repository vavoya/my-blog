import SearchFolder, {SelectFolder} from "@/app/management/_components/searchFolder/SearchFolder";
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
                    <div className={styles.inputBox}>
                        <h3 className={styles.inputTitle}>
                            대표 이미지 URL
                        </h3>
                        <label className={'sr-only'}>대표 이미지 URL</label>
                        <input className={styles.inputText}
                               defaultValue={thumbnail}
                               onBlur={(e) => setThumbnail(e.target.value)}
                               type="text"
                               placeholder={"포스트 대표 이미지 url을 적어주새요."}/>
                    </div>
                    <div className={styles.thumbnail}>
                        <Img src={thumbnail} />
                    </div>
                </div>
                <div className={styles.inputBox}>
                    <h3 className={styles.inputTitle}>
                        *폴더 경로
                    </h3>
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
                </div>
                <div className={styles.inputBox}>
                    <h3 className={styles.inputTitle}>
                        포스트 설명
                    </h3>
                    <label className={'sr-only'}>포스트 설명</label>
                    <input className={styles.inputText}
                           placeholder={"포스트에 대한 간략한 설명을 적어주세요"}
                           defaultValue={description}
                           onChange={(e) => setDescription(e.target.value)}
                           type="text"
                           maxLength={POST_DESCRIPTION_LIMIT}/>
                </div>
            </div>
            <Button primary={{text: isCreating ? "생성" : "저장", onClick: () => fetchPost(thumbnail, selectedFolderId, description)}} secondary={{text: "이전", onClick: () => onPrevStep(thumbnail, selectedFolderId, description)}} danger={onDanger ? {text: "삭제", onClick: onDanger} : undefined}/>
        </div>
    )
}
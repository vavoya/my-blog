import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {FolderObj} from "@/components/modal/utils/toObj";
import TrieSearch from "trie-search";
import {useRef, useState} from "react";
import useRootMouseDownOutside from "@/hook/useRootMouseDownOutside";
import {buildFolderPath} from "@/utils/buildFolderPath";

export type SelectFolder = (folder: FolderInfoResponse) => void;
type SearchFolderProps = {
    selectFolder: (folder: FolderInfoResponse) => void;
    folderObj: FolderObj;
    initFolderId?: FolderInfoResponse['_id'];
    trie: TrieSearch<FolderInfoResponse>;
    classNames?: {
        input?: string;
        listBoxRoot?: string;
        listBox?: string;
        list?: string;
        text?: string;
    }
    placeholder?: string;
    labelText?: string;
}

export default function SearchFolder({ selectFolder, folderObj, trie, initFolderId, classNames = {}, placeholder, labelText }: SearchFolderProps) {
    const [ searchNameList, setSearchNameList] = useState<FolderInfoResponse[]>([]);
    const [ selectedFolder, setSelectedFolder ] = useState<FolderInfoResponse | undefined>(initFolderId ? folderObj[initFolderId] : undefined);
    const ulRef = useRef<HTMLUListElement>(null);
    useRootMouseDownOutside(ulRef, () => setSearchNameList([]))

    const selectedFolderPath = selectedFolder ? buildFolderPath(selectedFolder, folderObj) : undefined;

    return (
        <>
            <label className="sr-only" htmlFor="folder-name">{labelText ?? "이동할 폴더 이름 검색"}</label>
            <input type="text"
                   tabIndex={0}
                   autoComplete={"off"}
                   aria-autocomplete="list"
                   aria-controls="suggestion-list"
                   id="folder-name"
                   onChange={(e) => {
                       setSearchNameList(trie.search(e.target.value))
                   }}
                   className={classNames?.input}
                   placeholder={placeholder ?? "이동할 폴더 이름을 입력하세요."} />
            <div className={classNames?.listBoxRoot}>
                {
                    (searchNameList.length > 0) && (
                        <ul ref={ulRef} role="listbox" className={classNames?.listBox}>
                            {
                                searchNameList.map(folder => (
                                    <li role="option"
                                        aria-selected="false"
                                        tabIndex={0}
                                        key={folder._id}
                                        className={classNames?.list}
                                        onClick={() => {
                                            setSearchNameList([])
                                            setSelectedFolder(folder);
                                            selectFolder(folder);
                                        }}>
                                    <span>
                                        {buildFolderPath(folder, folderObj)}
                                    </span>
                                    </li>
                                ))
                            }
                        </ul>
                    )
                }
            </div>
            <span className={classNames?.text}>
                { selectedFolderPath  }
            </span>
        </>
    )
}

import TrieSearch from "trie-search";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {FolderObj} from "@/components/modal/utils/toObj";


export type FolderTrie = TrieSearch<FolderInfoResponse>
/**
 * 주어진 폴더 객체에서 트라이 데이터 구조를 구성합니다.
 *
 * @param {FolderObj} folderObj - 폴더 식별자를 키로 가지고 폴더 정보를 값으로 가지는 객체입니다.
 * @returns {FolderTrie} 폴더 이름으로 빠른 검색이 가능하도록 최적화된 트라이 구조를 반환합니다.
 */
export const buildTrie = (folderObj: FolderObj) => {
    const trie: FolderTrie = new TrieSearch<FolderInfoResponse>('folder_name', {
        splitOnRegEx: false,
        idFieldOrFunction: '_id'
    })
    trie.addAll(Object.values(folderObj));
    return trie;
}
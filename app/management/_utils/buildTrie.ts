import TrieSearch from "trie-search";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {FolderObj} from "@/components/modal/utils/toObj";


export type FolderTrie = TrieSearch<FolderInfoResponse>
export const buildTrie = (folderObj: FolderObj) => {
    const trie: FolderTrie = new TrieSearch<FolderInfoResponse>('folder_name', {
        splitOnRegEx: false,
        idFieldOrFunction: '_id'
    })
    trie.addAll(Object.values(folderObj));
    return trie;
}
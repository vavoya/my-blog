import { createStore, type StoreApi } from "zustand/vanilla";
import {createContext, useContext, useMemo, ReactNode} from "react";
import { UserInfoResponse } from "@/lib/mongoDB/types/documents/userInfo.type";
import { FolderObj, SeriesObj } from "@/components/modal/utils/toObj";
import { SetWindows } from "@/app/management/_components/Background";
import {useStore} from "zustand/react";
import TrieSearch from "trie-search";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";

type Store = {
    userInfo: UserInfoResponse;
    setUserInfo: (userInfo: UserInfoResponse) => void;
    folderObj: FolderObj;
    setFolderObj: (folderObj: FolderObj) => void;
    seriesObj: SeriesObj;
    setSeriesObj: (seriesObj: SeriesObj) => void;
    trie: TrieSearch<FolderInfoResponse>;
    setTrie: (trie: TrieSearch<FolderInfoResponse>) => void;
    setWindows: SetWindows;
};


type ManagementProviderProps = Pick<Store, "userInfo" | "folderObj" | "seriesObj" | "setWindows" | "trie"> & {
    children: ReactNode;
};

// StoreApi<Store>로 명시
// "더미" store 인스턴스 생성 (최소 기능만 들어있어도 됨)
const dummyStore = createStore<Store>((set) => ({
    userInfo: {
        _id: "",
        auth_id: "",
        blog_name: "",
        user_name: "",
        email: "",
        blog_url: "",
        next_post_id: 0,
        registration_state: true,
        last_modified: "",
    },
    setUserInfo: (userInfo) => set({ userInfo }),
    folderObj: {},
    setFolderObj: (folderObj) => set({ folderObj }),
    seriesObj: {},
    setSeriesObj: (seriesObj) => set({ seriesObj }),
    trie: new TrieSearch(),
    setTrie: (trie) => set({ trie }),
    setWindows: () => {},
}));


// null 없이, 반드시 StoreApi<Store> 타입만 허용
export const StoreContext = createContext<StoreApi<Store>>(dummyStore);

// 타입 명확히 (selector의 반환값을 제네릭으로 받을 수도 있음)
export function useManagementStore<T>(selector: (state: Store) => T): T {
    const store = useContext(StoreContext);
    return useStore(store, selector);
}

export default function ManagementProvider({
                                               userInfo,
                                               folderObj,
                                               seriesObj,
                                               setWindows,
                                               trie,
                                               children,
                                           }: ManagementProviderProps) {
    const store = useMemo(
        () =>
            createStore<Store>((set) => ({
                userInfo,
                setUserInfo: (userInfo) => set({ userInfo }),
                folderObj,
                setFolderObj: (folderObj) => set({ folderObj }),
                seriesObj,
                setSeriesObj: (seriesObj) => set({ seriesObj }),
                trie,
                setTrie: (trie) => set({ trie }),
                setWindows,
            })),
        []
    );

    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
}

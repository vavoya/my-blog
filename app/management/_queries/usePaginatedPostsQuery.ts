import {useInfiniteQuery} from "@tanstack/react-query";
import queryClient from "@/app/management/_queries/index";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import getByFolderId from "@/fetch/client/paginatedPost/getByFolderId";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {useRef} from "react";
import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";


export function usePaginatedPostsQuery(userId: UserInfoResponse['_id'], folderId: FolderInfoResponse['_id'], maxPage: number) {
    const maxPageRef = useRef(maxPage)
    maxPageRef.current = maxPage
    return useInfiniteQuery({
        queryKey: ['paginatedPosts', userId, folderId],
        queryFn: async ({pageParam: page = 1}) => {
            return await getByFolderId(userId, folderId, page)
        },
        getNextPageParam(_lastPage, _allPages, lastPageParam) {
            const maxPage = maxPageRef.current;
            return lastPageParam < maxPage ? lastPageParam + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: Infinity,
        gcTime: Infinity,

    })
}

export const updatePaginatedPostsQuery = async (userId: UserInfoResponse['_id'], folderId: FolderInfoResponse['_id']) => {
    return await queryClient.invalidateQueries({ queryKey: ['paginatedPosts', userId, folderId], });
}

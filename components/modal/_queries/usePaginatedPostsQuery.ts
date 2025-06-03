import {useQuery} from "@tanstack/react-query";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import getByFolderId from "@/fetch/client/paginatedPost/getByFolderId";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";

export function usePaginatedPostsQuery(userId: UserInfoResponse['_id'], folderId: FolderInfoResponse['_id'], page: number) {

    return useQuery({
        queryKey: ['paginatedPosts', userId, folderId, page],
        queryFn: async () => {
            return await getByFolderId(userId, folderId, page)
        },
        staleTime: Infinity,
        gcTime: Infinity,
    })
}


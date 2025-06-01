import {useQuery} from "@tanstack/react-query";
import getByPostUrl from "@/fetch/client/postInfo/getByPostUrl";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {PaginatedPostsResponse} from "@/models/post_info/types";


export function usePostQuery(userId: UserInfoResponse['_id'], postUrl: PaginatedPostsResponse['post_url']) {
    return useQuery({
        queryKey: ['post', userId, postUrl],
        queryFn: async () => {
            return await getByPostUrl(userId, postUrl);
        },
        staleTime: 0,
        gcTime: 0,
    })
}

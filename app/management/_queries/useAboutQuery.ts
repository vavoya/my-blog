import {useQuery} from "@tanstack/react-query";
import getByUserId from "@/fetch/client/aboutInfo/getByUserId";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";


export function useAboutQuery(userId: UserInfoResponse['_id']) {
    return useQuery({
        queryKey: ['about', userId],
        queryFn: async () => {
            return await getByUserId(userId);
        },
        staleTime: 0,
        gcTime: 0,
    })
}

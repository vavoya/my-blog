import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {useQueryClient} from "@tanstack/react-query";
import {PaginatedPostsResponse} from "@/data-access/post-info/types";
import getByPostIds from "@/fetch/client/paginated-post/getByPostIds";
import {useCallback, useEffect, useRef, useState} from "react";
import {QueryClient} from "@tanstack/query-core";

// id에 해당하는 페이지네이션 포스트
const createPostQueryKey = (userId: UserInfoResponse['_id'], postId: SeriesInfoResponse['post_list'][number]) => {
    return ['paginatedPostIds', userId, postId]
}
const removeCachedPaginatedPost = (userId: UserInfoResponse['_id'], postId: SeriesInfoResponse['post_list'][number], queryClient: QueryClient) => {
    queryClient.removeQueries({queryKey: createPostQueryKey(userId, postId)});
}
const getCachedPaginatedPost = (userId: UserInfoResponse['_id'], postId: SeriesInfoResponse['post_list'][number], queryClient: QueryClient) => {
    return queryClient.getQueryData<PaginatedPostsResponse>(createPostQueryKey(userId, postId))
}
const setCachedPaginatedPost = (userId: UserInfoResponse['_id'], post: PaginatedPostsResponse, queryClient: QueryClient) => {
    return queryClient.setQueryData<PaginatedPostsResponse>(createPostQueryKey(userId, post._id), ()=> {
        return post;
    })
}

// 지금까지 페이지네이션된 postId 목록
const createPostIdsQueryKey = (userId: UserInfoResponse['_id']) => {
    return ['cachedPostIds', userId]
}
const getCachedPostIds = (userId: UserInfoResponse['_id'], queryClient: QueryClient) => {
    return queryClient.getQueryData<PaginatedPostsResponse['_id'][]>(createPostIdsQueryKey(userId))
}
const setCachedPostIds = (userId: UserInfoResponse['_id'], postIds: PaginatedPostsResponse['_id'][], queryClient: QueryClient) => {
    return  queryClient.setQueryData<SeriesInfoResponse['post_list']>(createPostIdsQueryKey(userId), (prevValue) => {
        return !!prevValue ? [...new Set([...prevValue, ...postIds])] : postIds;
    })
}

export const refetchPaginatedPosts = (userId: string, queryClient: QueryClient) => {
    const fn = queryClient.getQueryData<() => void>(['loadHandler', userId]);
    fn?.();
};
// postIds 들을 반환
export function usePaginatedPostIdsQuery(userId: UserInfoResponse['_id'], postIds: SeriesInfoResponse['post_list']) {
    const queryClient = useQueryClient();
    const [data, setData] = useState<PaginatedPostsResponse[]>([]);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isFetching, setIsFetching] = useState(true);

    const postIdsRef = useRef(postIds);
    postIdsRef.current = postIds;

    const load = useCallback(async () => {
        // 에러 초기화
        setIsError(false);
        setErrorMessage("");

        const currentPostIds = postIdsRef.current;
        const missedIds = currentPostIds.filter(
            (id) => !getCachedPaginatedPost(userId, id, queryClient)
        );

        if (missedIds.length === 0) {
            const posts = currentPostIds
                .map((id) => getCachedPaginatedPost(userId, id, queryClient))
                .filter((p): p is PaginatedPostsResponse => !!p);
            // 데이터 설정 및 fetching 종료
            setData(posts);
            setIsFetching(false);
            return;
        }

        // fetching 시작
        setIsFetching(true);
        const result = await getByPostIds(userId, missedIds);
        if (result.status === 200) {
            setCachedPostIds(userId, missedIds, queryClient);
            result.data.forEach((post) => {
                setCachedPaginatedPost(userId, post, queryClient);
            });
            const posts = currentPostIds
                .map((id) => getCachedPaginatedPost(userId, id, queryClient))
                .filter((p): p is PaginatedPostsResponse => !!p);
            setData(posts);
        } else {
            // 오류 핸들링이 필요하다면 여기에 추가
            setIsError(true);
            setErrorMessage(result.message);
        }
        setIsFetching(false);
    }, [queryClient, userId]);

    // invalidate 트리거
    useEffect(() => {
        load();
    }, [postIds, load]);

    useEffect(() => {
        queryClient.setQueryData(['loadHandler', userId], () => load);
        return () => {
            queryClient.removeQueries({ queryKey: ['loadHandler', userId] });
        };
    }, [queryClient, userId, load]);


    return { data, isFetching, isError, errorMessage };
}


export const removeCachedPaginatedPosts = (userId: UserInfoResponse['_id'], postIds: SeriesInfoResponse['post_list'], queryClient: QueryClient) => {
    // 페이지네이션 포스트 캐시 제거
    // cachedId 제거
    const cachedPostIds = new Set(getCachedPostIds(userId, queryClient));
    postIds.forEach(postId => {
        removeCachedPaginatedPost(userId, postId, queryClient);
        cachedPostIds.delete(postId);
    });

    setCachedPostIds(userId, Array.from(cachedPostIds), queryClient);
};

/**
 * 지정된 시리즈 id를 기준으로 추가될 포스트와 삭제될 포스트의 series_id를 수정
 *
 * @param {UserInfoResponse['_id']} userId - 사용자의 고유 식별자.
 * @param {SeriesInfoResponse['_id']} seriesId - 시리즈의 고유 식별자.
 * @param {SeriesInfoResponse['post_list']} addIds
 * @param {SeriesInfoResponse['post_list']} removeIds
 * @param {QueryClient} queryClient - 캐시 데이터와 상호작용하기 위해 사용되는 쿼리 클라이언트 인스턴스.
 */
export const updateCachedPaginatedPostsSeriesId = (userId: UserInfoResponse['_id'], seriesId: SeriesInfoResponse['_id'], addIds: SeriesInfoResponse['post_list'], removeIds: SeriesInfoResponse['post_list'], queryClient: QueryClient) => {
    // Add series_id to posts being added to series
    addIds.forEach(postId => {
        const post = getCachedPaginatedPost(userId, postId, queryClient);
        if (post) {
            const updatedPost = {...post, series_id: seriesId};
            setCachedPaginatedPost(userId, updatedPost, queryClient);
        }
    });

    // Remove series_id from posts being removed from series 
    removeIds.forEach(postId => {
        const post = getCachedPaginatedPost(userId, postId, queryClient);
        if (post) {
            const updatedPost = {...post, series_id: null};
            setCachedPaginatedPost(userId, updatedPost, queryClient);
        }
    });

    // Trigger UI refetch
    refetchPaginatedPosts(userId, queryClient);
};

// 포스트 정보 변경에 사용
// 캐시에 존재하는 페이지네이션 포스트만 업데이트하고, 최신 상태로 재동기화
/**
 * 사용자별로 페이지네이션된 게시물 캐시를 동기화 및 업데이트하고, UI에서 변경 사항을 반영하기 위해 동기화를 트리거합니다.
 *
 * @param {string} userId - 캐시를 동기화할 사용자의 고유 식별자.
 * @param {PaginatedPostsResponse[]} updatedPosts - 캐시와 동기화할 업데이트된 페이지네이션 게시물 객체 배열.
 * @param {QueryClient} queryClient - 캐시 쿼리와 변형을 관리하는 쿼리 클라이언트 인스턴스.
 *
 * @description
 * 캐시된 게시물 데이터를 업데이트된 게시물 목록과 동기화하고,
 * 변경사항이 적용된 데이터를 UI에 반영하기 위해 재동기화를 트리거합니다.
  */
export const syncUpdatedPaginatedPosts = (
    userId: UserInfoResponse['_id'],
    updatedPosts: PaginatedPostsResponse[],
    queryClient: QueryClient
) => {
    updatedPosts.forEach(post => {
        if (getCachedPaginatedPost(userId, post._id, queryClient)) {
            setCachedPaginatedPost(userId, post, queryClient);
        }
    });

    // UI 반영을 위한 재동기화
    refetchPaginatedPosts(userId, queryClient);
};

// 폴더 삭제로 인한 폴더 트리 변경
// 특정 폴더에 속한 포스트들을 새 폴더 ID로 이동시키고, 반영 후 재동기화
/**
 * 페이지네이션된 데이터셋 내에서 게시글들을 한 폴더에서 다른 폴더로 이동시키며, 캐시된 데이터를 업데이트한다.
 *
 * @param {string} userId - 게시글을 수정할 사용자의 고유 식별자.
 * @param {string} prevFolderId - 게시글이 현재 속해 있는 폴더의 ID.
 * @param {string} nextFolderId - 게시글을 이동시킬 대상 폴더의 ID.
 * @param {QueryClient} queryClient - 캐시 조작 및 데이터 조회에 사용되는 QueryClient 인스턴스.
 *
 * @returns {void}
 *
 * @description
 * 이 함수는 해당 사용자의 캐시된 게시글 목록을 순회하며, 각 게시글이 이전 폴더(prevFolderId)에 속해 있는지 확인한 후
 * 대상 폴더(nextFolderId)로 게시글의 폴더 ID를 변경한다. 캐시된 데이터에 변경이 발생한 경우,
 * 서버와의 동기화를 위해 페이지네이션된 게시글 데이터를 다시 가져오도록 트리거한다.
 */
export const movePaginatedPostsToFolder = (
    userId: UserInfoResponse['_id'],
    prevFolderId: PaginatedPostsResponse['folder_id'],
    nextFolderId: PaginatedPostsResponse['folder_id'],
    queryClient: QueryClient
) => {
    const cachedPostIds = getCachedPostIds(userId, queryClient);
    let isUpdated = false;

    if (cachedPostIds) {
        cachedPostIds.forEach(postId => {
            const post = getCachedPaginatedPost(userId, postId, queryClient);
            if (post && post.folder_id === prevFolderId) {
                const updatedPost = { ...post, folder_id: nextFolderId };
                setCachedPaginatedPost(userId, updatedPost, queryClient);
                isUpdated = true;
            }
        });
    }

    // 변경사항이 있으면 다시 동기화
    if (isUpdated) {
        refetchPaginatedPosts(userId, queryClient);
    }
};

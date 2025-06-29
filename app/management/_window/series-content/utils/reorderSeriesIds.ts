import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";

/**
 * 시리즈 포스트의 ID를 재정렬하여 특정 포스트 ID를 원하는 위치로 이동시킵니다.
 *
 * @param {number} number 지정된 포스트 ID를 이동시킬 1 기반 목표 위치
 * @param {PostInfoResponse['_id'][]} postIds 시리즈 내 원본 포스트 ID 배열
 * @param {number} order 재정렬할 포스트 ID의 현재 0 기반 배열 인덱스
 * @param {PostInfoResponse['_id']} postId 새로운 위치로 이동될 포스트 ID
 * @return {PostInfoResponse['_id'][]} 업데이트된 순서가 반영된 새로운 포스트 ID 배열
 */
export function reorderSeriesIds(number: any, postIds: PostInfoResponse['_id'][], order: number, postId: PostInfoResponse['_id']) {
    const newPostIds = [...postIds];

    if (!isNaN(number)) {
        const t = Math.max(number - 1, 0); // 0-based index
        const t2 = Math.min(t, postIds.length - 1); // 최대 index까지 허용

        newPostIds.splice(order, 1);
        newPostIds.splice(t2, 0, postId);

    }

    return newPostIds;
}
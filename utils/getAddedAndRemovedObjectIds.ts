import { ObjectId } from "mongodb";

type ObjectIdLike = ObjectId | string;

/**
 * 이전 배열과 다음 배열을 비교하여,
 * 추가된 요소와 제거된 요소를 찾아냅니다.
 *
 * 요소는 ObjectId 혹은 문자열이어야 하며,
 * toString()으로 비교합니다.
 *
 * @template T ObjectId 또는 문자열
 * @param prev 이전 상태의 배열
 * @param next 다음 상태의 배열
 * @returns 변경된 요소 목록 객체
 * - `add`: next 배열에만 존재하는 요소
 * - `remove`: prev 배열에만 존재하는 요소
 */
export function getAddedAndRemovedObjectIds<T extends ObjectIdLike>(
    prev: T[],
    next: T[]
): { add: T[]; remove: T[] } {
    const toStr = (id: T) => id.toString();

    const prevSet = new Set(prev.map(toStr));
    const nextSet = new Set(next.map(toStr));

    const add = next.filter(id => !prevSet.has(toStr(id)));
    const remove = prev.filter(id => !nextSet.has(toStr(id)));

    return { add, remove };
}

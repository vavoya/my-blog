/**
 * 주어진 객체가 지정된 shape와 동일한 구조를 갖는지 검사합니다.
 *
 * shape는 각 필드에 대해 기대하는 타입을 문자열로 명시하며,
 * 배열의 경우 해당 타입을 요소로 갖는 배열을 포함해야 합니다.
 *
 * @template T 기대하는 객체의 형태
 * @param obj 검사할 대상 객체 (any)
 * @param shape 객체의 기대 형태 (타입 이름을 값으로 갖는 객체)
 * @returns obj가 해당 shape를 만족하면 true, 그렇지 않으면 false
 *
 * @example
 * isShape({ name: "foo", age: 20 }, { name: "string", age: "number" }) // true
 * isShape({ tags: ["a", "b"] }, { tags: ["string"] }) // true
 */
export function isShape<T extends object>(obj: any, shape: T): obj is T {
    if (typeof obj !== 'object' || obj === null) return false;

    const objKeys = Object.keys(obj);
    const shapeKeys = Object.keys(shape);

    const anyShape = shape as any;

    for (const key of shapeKeys) {
        // key가 존재하지 않으면
        if (!(key in obj)) return false;

        // key의 타입이 서로 다르면
        // 배열인 경우
        if (Array.isArray(obj[key]) && Array.isArray(anyShape[key])) {
            const arrayType = anyShape[key][0];
            if (!(obj[key].every(item => typeof item === arrayType))) return false;
        } else if (typeof obj[key] !== anyShape[key]) return false;
    }

    for (const key of objKeys) {
        if (!shapeKeys.includes(key)) return false;
    }

    return true;
}

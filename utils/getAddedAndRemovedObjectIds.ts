import { ObjectId } from "mongodb";

type ObjectIdLike = ObjectId | string;

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
};

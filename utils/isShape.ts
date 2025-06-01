export const isShape = <T extends object>(obj: any, shape: T): obj is T => {
    if (typeof obj !== 'object' || obj === null) return false;

    const objKeys = Object.keys(obj);
    const shapeKeys = Object.keys(shape);

    for (const key of shapeKeys) {
        if (!(key in obj)) return false;
        if (typeof obj[key] !== (shape as any)[key]) return false;
    }

    for (const key of objKeys) {
        if (!shapeKeys.includes(key)) return false;
    }

    return true;
};

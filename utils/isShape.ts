export const isShape = <T extends object>(obj: any, shape: T): obj is T => {
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
};

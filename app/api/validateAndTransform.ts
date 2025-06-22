export default function validateAndTransform(
    input: string | null,
    type: 'number'
): number
export default function validateAndTransform(
    input: string | null,
    type: 'string'
): string
export default function validateAndTransform(
    input: string[] | null,
    type: 'number'
): number[]
export default function validateAndTransform(
    input: string[] | null,
    type: 'string'
): string[]
export default function validateAndTransform(
    input: string | string[] | null,
    type: 'number' | 'string'
): number | number[] | string | string[] {
    if (!input) {
        throw new Error('잘못된 입력: null은 허용되지 않습니다.')
    }

    if (Array.isArray(input)) {
        if (type === 'number') {
            const parsed = input.map(v => parseInt(v, 10))
            if (parsed.some(v => isNaN(v))) {
                throw new Error('잘못된 입력: 배열에 정수가 아닌 값이 포함되어 있습니다.')
            }
            return parsed
        }

        return input
    }

    if (type === 'number') {
        const parsed = parseInt(input, 10)
        if (isNaN(parsed)) {
            throw new Error('잘못된 입력: 유효한 숫자가 아닙니다.')
        }
        return parsed
    }

    return input
}



/*
const forbiddenPattern = /[\$\{\}\[\]\(\)\.]/

export default function validateAndTransform(
    input: string | null,
    type: 'number'
): number
export default function validateAndTransform(
    input: string | null,
    type: 'string'
): string
export default function validateAndTransform(
    input: string[] | null,
    type: 'number'
): number[]
export default function validateAndTransform(
    input: string[] | null,
    type: 'string'
): string[]
export default function validateAndTransform(
    input: string | string[] | null,
    type: 'number' | 'string'
): number | number[] | string | string[] {
    if (!input) {
        throw new Error('잘못된 입력: null은 허용되지 않습니다.')
    }

    if (Array.isArray(input)) {
        if (type === 'number') {
            const parsed = input.map(v => parseInt(v, 10))
            if (parsed.some(v => isNaN(v))) {
                throw new Error('잘못된 입력: 배열에 정수가 아닌 값이 포함되어 있습니다.')
            }
            return parsed
        }

        if (input.some(v => forbiddenPattern.test(v))) {
            throw new Error('잘못된 입력: 배열 내 금지된 문자가 포함되어 있습니다.')
        }

        return input
    }

    if (type === 'number') {
        const parsed = parseInt(input, 10)
        if (isNaN(parsed)) {
            throw new Error('잘못된 입력: 유효한 숫자가 아닙니다.')
        }
        return parsed
    }

    if (forbiddenPattern.test(input)) {
        throw new Error('잘못된 입력: 금지된 문자가 포함되어 있습니다.')
    }

    return input
}
 */
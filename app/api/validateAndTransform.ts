/**
 * 제공된 입력값을 검증하고 지정된 타입으로 변환합니다.
 *
 * @param {string | null} input 검증 및 변환할 입력값.
 * @param {'number'} type 입력값을 변환할 대상 타입. 현재는 'number'만 지원합니다.
 * @return {number} 검증이 성공하면 변환된 값을 반환합니다.
 * @throws {Error} 입력값이 유효하지 않거나 지정된 타입으로 변환할 수 없는 경우 에러가 발생합니다.
 */
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
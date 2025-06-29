/**
 * 문자열을 URL-safe한 slug로 변환합니다.
 *
 * RFC 3986 기준에 따라 URL 경로에서 안전하지 않은 문자를 하이픈(-)으로 대체하고,
 * 연속된 하이픈을 하나로 줄이며, 앞뒤 하이픈을 제거합니다.
 *
 * 아래 문자는 예외 없이 허용됩니다:
 * - 영문자/숫자 (A-Z, a-z, 0-9)
 * - 한국어 (가-힣, 초성/중성/종성 조합 포함)
 * - 일본어(히라가나/가타카나), 한자, 전각 문자 등
 * - 일반적인 safe 문자: `_`, `-`, `.`, `~`
 *
 * @param text 변환할 원본 문자열
 * @returns slugified 문자열
 *
 * @example
 * slugify("Hello 월드!") // "Hello-월드"
 */
export function slugify(text: string) {
    // RFC 3986 기준 URL path에서 안전하지 않은 문자만 하이픈으로 대체
    return text
        .replace(/[^A-Za-z0-9\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\u4E00-\u9FFF\u3040-\u30FF\uFF00-\uFFEF\w\-\.~]+/gu, '-') // 다국어 포함, 일반적인 safe 문자 허용
        .replace(/-+/g, '-') // 연속 하이픈을 하나로
        .replace(/^-|-$/g, ''); // 양끝 하이픈 제거
}
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * 주어진 문자열이 유효한 슬러그(slug) 형식인지 검사합니다.
 *
 * 유효한 슬러그는 다음 조건을 만족해야 합니다:
 * - 소문자 알파벳(a-z), 숫자(0-9)만 포함
 * - 단어 사이는 하이픈(-)으로 연결
 * - 하이픈으로 시작하거나 끝나면 안 됨
 * - 연속된 하이픈은 허용되지 않음
 *
 * 예: "valid-slug", "a1-b2-c3" → 유효 / "Invalid", "a--b", "-start" → 무효
 *
 * @param slug 검사할 문자열
 * @returns 유효하면 true, 그렇지 않으면 false
 */
export function isValidSlug(slug: string): boolean {
    return SLUG_REGEX.test(slug)
}

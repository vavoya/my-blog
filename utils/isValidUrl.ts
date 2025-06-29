
/**
 * 주어진 문자열이 유효한 URL인지 검사합니다.
 *
 * 이 함수는 `URL` 생성자를 사용하여 검사하며,
 * 스킴(scheme)이 포함된 절대 URL만 유효하다고 판단합니다.
 * (예: "https://example.com" → 유효, "example.com" → 무효)
 *
 * @param str 검사할 문자열
 * @returns URL 생성이 성공하면 true, 실패하면 false
 */
export function isValidUrl(str: string) {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}
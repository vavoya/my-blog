export const slugify = (text: string) => {
    // RFC 3986 기준 URL path에서 안전하지 않은 문자만 하이픈으로 대체
    return text
        .replace(/[^A-Za-z0-9\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\u4E00-\u9FFF\u3040-\u30FF\uFF00-\uFFEF\w\-\.~]+/gu, '-') // 다국어 포함, 일반적인 safe 문자 허용
        .replace(/-+/g, '-') // 연속 하이픈을 하나로
        .replace(/^-|-$/g, ''); // 양끝 하이픈 제거
}
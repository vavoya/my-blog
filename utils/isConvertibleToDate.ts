/**
 * 주어진 문자열이 유효한 날짜(Date)로 변환 가능한지 여부를 반환합니다.
 *
 * @param str 검사할 문자열
 * @returns `true` - Date로 변환 가능한 경우
 *          `false` - 변환 시 NaN이 발생하는 경우 (즉, 유효하지 않은 날짜 문자열)
 */
export function isConvertibleToDate (str: string)  {
    const d = new Date(str);
    return !isNaN(d.getTime());
}
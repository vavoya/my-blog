
/**
 * Date 객체를 받아서 `'year.month.day hours:minutes'` 형식으로 변환합니다.
 *
 * @param date 변환할 대상 Date 객체 입니다.
 * @param withTime 문자열에 시간을 포함할지 여부 입니다. 기본은 false 입니다.
 * @return `'year.month.day hours:minutes'` 문자열을 반환합니다.
 */
export function formatDate(date: Date, withTime: boolean = false) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (!withTime) {
        return `${year}.${month}.${day}`;
    }

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
}

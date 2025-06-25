/**
 * 객체를 넘기면 JSON 문자열로 직렬화하고,
 * 이를 UTF-8 바이트로 인코딩한 ReadableStream<Uint8Array>를 반환합니다.
 *
 * @param {any} obj - 직렬화할 객체
 * @return {ReadableStream<Uint8Array>} JSON 직렬화 결과의 바이트 스트림
 */
export function createJsonStream(obj: any): ReadableStream<Uint8Array> {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);

    return new globalThis.ReadableStream({
        start(controller) {
            controller.enqueue(bytes);
            controller.close();
        }
    });
}

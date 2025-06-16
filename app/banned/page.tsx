
type SearchParams = Promise<{
    reason: string;
}>

export default async function Page({searchParams}: { searchParams: SearchParams}) {
    const { reason } = await searchParams;




    return (
        <div>
            <h1>
                계정 차단 안내
                <br/>
                <br/>
            </h1>
            <p>
                이 계정은 현재 차단되어 있어 서비스에 접근하실 수 없습니다.
                <br/>
                <br/>
            </p>
            <p>
                사유: <strong>{reason}</strong>
                <br/>
                <br/>
            </p>
            <p>
                문의가 필요하신 경우 vavoya6324@gmail.com 으로 연락주시기 바랍니다.
            </p>
        </div>
    )
}
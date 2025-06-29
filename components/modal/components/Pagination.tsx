import SvgFirst from "@/components/svg/First";
import SvgPrev from "@/components/svg/Prev";
import SvgNext from "@/components/svg/Next";
import SvgLast from "@/components/svg/Last";

export default function Pagination({getPaginatedPosts, pageNum, maxPageNum}: {
    getPaginatedPosts: (pageNum: number) => void
    pageNum: number,
    maxPageNum: number
}) {

    return (
        <>
            <button disabled={!(2 < pageNum)} onClick={() => {
                getPaginatedPosts(1)
            }}>
                { 2 < pageNum ? <SvgFirst/> : null }
            </button>
            <button disabled={!(1 < pageNum)} onClick={() => {
                getPaginatedPosts(pageNum - 1)
            }}>
                { 1 < pageNum ? <SvgPrev/> : null}
            </button>
            <span>
                {pageNum}
            </span>
            <button disabled={!(pageNum < maxPageNum)} onClick={() => {
                getPaginatedPosts(pageNum + 1)
            }}>
                { pageNum < maxPageNum ? <SvgNext/> : null}
            </button>
            <button disabled={!(pageNum < maxPageNum - 1)} onClick={() => {
                getPaginatedPosts(maxPageNum)
            }}>
                { pageNum < maxPageNum - 1 ? <SvgLast/> : null}
            </button>
        </>
    )
}
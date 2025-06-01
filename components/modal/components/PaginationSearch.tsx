import {useRef} from "react";
import SvgSearch from "@/components/svg/Search";

export default function PaginationSearch({maxPageNum, getPaginatedPosts} : {
    maxPageNum: number,
    getPaginatedPosts: (pageNum: number) => void
}) {
    const searchRef = useRef<HTMLInputElement>(null);


    return (
        <div>
            <input ref={searchRef} placeholder={"숫자"}>

            </input>
            <button onClick={() => {
                if (!searchRef.current) {return}
                const value = searchRef.current.value;
                const numericValue = Number(value);
                if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= maxPageNum) {
                    getPaginatedPosts(numericValue)
                }
            }}>
                <SvgSearch width={20} height={20}/>
            </button>
        </div>
    )
}
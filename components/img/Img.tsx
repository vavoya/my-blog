import {useEffect, useState} from "react";
import Image from "next/image";
import {isValidUrl} from "@/utils/isValidUrl";

export const ERROR_MESSAGE = {
    INVALID_URL: "유효하지 않은 url 입니다.",
    LOADING: "이미지를 불러올 수 없습니다.",
}

type ImgProps = {
    src: string;
}
export default function Img({src}: ImgProps) {
    const [isError, setIsError] = useState(false);

    // 새 src -> 에러 초기화
    useEffect(() => {
        setIsError(false);
    }, [src])

    if (!src) {
        return null;
    }

    if (!isValidUrl(src)) {
        return <span>{ERROR_MESSAGE.INVALID_URL}</span>;
    }

    if (!isError) {
        return (

            <Image src={src}
                   alt={"대표 이미지 미리보기"}
                   fill
                   objectFit={"cover"}
                   onError={() => {
                       setIsError(true)
                   }}/>
        )
    } else {
        return (
            <span>{ERROR_MESSAGE.LOADING}</span>
        )
    }
}
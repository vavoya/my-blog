import BadRequestPage from "@/app/_error/BadRequestPage";
import NotFoundPage from "@/app/_error/NotFoundPage";
import ServerErrorPage from "@/app/_error/ServerErrorPage";
import {ErrorResponse} from "@/app/api/types";
import {ReactNode} from "react";


export const renderError = (status: ErrorResponse['status'], url: string): ReactNode => {
    const map = {
        400: <BadRequestPage url={url} />,
        404: <NotFoundPage url={url} />,
        500: <ServerErrorPage url={url} />,
    };

    if (status in map) {
        return map[status as keyof typeof map]
    } else {
        return <ServerErrorPage url={url} />
    }
};
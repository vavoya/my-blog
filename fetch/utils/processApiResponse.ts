import {response} from "@/app/api/_utils/createResponse";
import {Response as Res} from "@/app/api/types";

export const processApiResponse = async <ResBodyType>(result: Response): Promise<ResBodyType | Res<never>> => {
    if (result.status === 429) {
        return response.toManyRequests('요청이 너무 많습니다. 1분 후 다시 시도해 주세요.');
    }

    return await result.json();
};


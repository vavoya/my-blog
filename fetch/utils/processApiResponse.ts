import {ResBodyType} from "@/app/api/client/post-info/by-session/type";
import {response} from "@/app/api/_utils/createResponse";

export const processApiResponse = async (result: Response): Promise<ResBodyType> => {
    if (result.status === 429) {
        return response.toManyRequests('요청이 너무 많습니다. 1분 후 다시 시도해 주세요.');
    }

    return await result.json();
};


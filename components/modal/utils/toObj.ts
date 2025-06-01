import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";


export type SeriesObj = { [id: SeriesInfoResponse['_id']]: SeriesInfoResponse };
export type FolderObj = { [id: FolderInfoResponse['_id']]: FolderInfoResponse };

function toObj(infoResponse: FolderInfoResponse[]): FolderObj;
function toObj(infoResponse: SeriesInfoResponse[]): SeriesObj;
function toObj(infoResponse: (FolderInfoResponse | SeriesInfoResponse)[]) {
    const obj = {} as SeriesObj | FolderObj

    return infoResponse.reduce((obj, cur) => {
        obj[cur._id] = { ...cur };
        return obj;
    }, obj);
}

export {
    toObj,
}


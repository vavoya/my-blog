import {isShape} from "@/utils/isShape";
import {deleteInputShape, DeleteByUserIdType} from "@/services/server/series/deleteByUserId.type";


export function validateDeleteSeries(body: any): body is DeleteByUserIdType {
    return isShape(body, deleteInputShape);
}
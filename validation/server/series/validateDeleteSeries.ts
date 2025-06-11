import {isShape} from "@/utils/isShape";
import {deleteInputShape, Type} from "@/services/server/series/deleteByUserId/type";


type ValidateDeleteSeries = (body: any) => body is Type
export const validateDeleteSeries: ValidateDeleteSeries = (body): body is Type => {
    return isShape(body, deleteInputShape);
}
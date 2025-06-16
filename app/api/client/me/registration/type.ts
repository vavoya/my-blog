import {Response} from "@/app/api/types";
import {CreateInput} from "@/services/server/registration/createByAuthId.type";

export type ReqBodyType = CreateInput
export type ResBodyType = Response<any>

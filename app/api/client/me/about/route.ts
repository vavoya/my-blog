import {auth} from "@/auth";
import {pathHandler} from "@/app/api/client/me/about/_handlers/patch";


export const PATCH = auth(pathHandler)

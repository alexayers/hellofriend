import {BaseModel} from "./baseModel";
import {Status} from "./status";

export interface StatusTag extends BaseModel {
    status: Status
    statusId: string
}

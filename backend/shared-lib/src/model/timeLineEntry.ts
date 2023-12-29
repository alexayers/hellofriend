import {BaseModel} from "./baseModel";
import {Account} from "./account";
import {Status} from "./status";


export interface TimeLineEntry extends BaseModel {
    account: Account
    status: Status
    expiresAt: number
}

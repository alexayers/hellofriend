import {BaseModel} from "./baseModel";


export interface Follow extends BaseModel {
    uri: string
    accepted: boolean
}

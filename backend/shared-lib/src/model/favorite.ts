import {BaseModel} from "./baseModel";
import {StatusDto} from "../dto/statusDto";


export interface Favorite extends BaseModel {
    status: StatusDto
}

import {BaseModel} from "./baseModel";
import {StatusDto} from "../dto/statusDto";


export interface Bookmark extends BaseModel {
    status: StatusDto
}

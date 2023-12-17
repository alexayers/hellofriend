import {BaseModel} from "./baseModel";


export interface RegisterUser extends BaseModel {
    email: string
    password?: string
    username: string
    displayName: string
}

export interface LoginUser {
    email: string
    password: string
}


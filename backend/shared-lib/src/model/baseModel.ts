export interface BaseModel {
    pkey: string
    skey?: string | number
    objectName: string
    createdAt?: number
    modifiedAt?: number
}

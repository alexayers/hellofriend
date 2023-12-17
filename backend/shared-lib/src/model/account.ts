import {BaseModel} from "./baseModel";


export interface Account extends BaseModel {
    webFingeredAt?: Date
    summary?: string
    displayName: string
    username: string
    domain?: string
    url?: string
    uri?: string
    avatarFilename?: string
    avatarFileSize?: number
    headerFilename?: string
    headerFileSize?: number
    privateKey: string
    publicKey?: string
    inboxUrl: string
    outboxUrl: string
    sharedInboxUrl: string
    followersUrl: string
    normalizedUserDomain: string
    memorial: boolean;
    indexable: boolean;
    discoverable: boolean;
}

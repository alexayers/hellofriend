import {BaseModel} from "./baseModel";


export interface Account extends BaseModel {
    webFingeredAt?: number
    summary?: string
    displayName: string
    username: string
    domain?: string
    url?: string
    uri?: string
    avatarFilename?: string
    avatarFileSize?: number
    avatarFileType?: string
    avatarRemotePath?: string
    headerFilename?: string
    headerFileSize?: number
    headerFileType?: string
    headerRemotePath?: string
    privateKey?: string
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

import {BaseModel} from "./baseModel";
import {Account} from "./account";
import {AccountDto} from "../dto/accountDto";


export interface Status extends BaseModel {
    text?: string
    spoilerText?: string
    inReplyToId?: string
    inReplyToAtomUri?: string
    inReplyToAccountId?: string
    statusBoostedId?: string
    language?: string
    published: string
    updated?: string
    deletedAt?: number;
    uri: string
    url: string
    accountId: string
    sensitive: boolean
    conversationId: string
    content: string
    account: AccountDto
}

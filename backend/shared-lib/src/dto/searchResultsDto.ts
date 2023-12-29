import {Account} from "../model/account";
import {StatusDto} from "./statusDto";
import {Tag} from "../model/tag";


export interface SearchResultsDto {
    accounts: Array<Account>
    statuses: Array<StatusDto>
    tags: Array<Tag>
}

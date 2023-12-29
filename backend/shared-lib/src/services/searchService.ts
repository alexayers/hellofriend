import {SearchResultsDto} from "../dto/searchResultsDto";
import {accountService, tagService, webFingerService} from "./index";
import {notValidResponse} from "../lambda/api-gateway";
import {Account} from "../model/account";
import {TagDto} from "../dto/tagDto";


export class SearchService {

    async search(query: string) : Promise<SearchResultsDto> {

        let searchResults: SearchResultsDto = {
            accounts: [],
            statuses: [],
            tags: []
        }

        if (query[0] == "@") {
            let userTokens: string [] = query.split("@");
            let filteredArray: string [] = userTokens.filter(element => element !== '');

            if (filteredArray.length != 2) {
                return null;
            }

            let account: Account = await webFingerService.finger(filteredArray[0],filteredArray[1]);
            searchResults.accounts.push(account);
        } else if (query[0] == "#") {
            let tagSearch: string = query.substring(1, query.length);
            searchResults.tags = await tagService.findMatch(tagSearch);
        } else {

        }


        return searchResults;
    }
}

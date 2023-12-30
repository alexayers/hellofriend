import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {openSearchService, webFingerService} from "@libs/services";
import {successResponse} from "@libs/lambda/api-gateway";
import {Account} from "@libs/model/account";
import {SearchResultsDto} from "@libs/dto/searchResultsDto";

interface SearchQuery {
    query: string
}

export const searchTimeline = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    let searchQuery : SearchQuery = event.body as unknown as SearchQuery;
    let searchResults : any = {
        accounts: [],
        statuses: [],
        tags: []
    };

    console.log(searchQuery);

    if(searchQuery.query[0] == "@") {
        let userTokens: string [] = searchQuery.query.split("@");
        let filteredArray: string [] = userTokens.filter(element => element !== '');

        if (filteredArray.length != 2) {
            return null;
        }

        let account: Account = await webFingerService.finger(filteredArray[0], filteredArray[1]);

        if (account) {

            searchResults.accounts.push({
                avatarFilename: account?.avatarFilename,
                displayName: account.displayName,
                domain: account?.domain,
                headerFilename: account?.headerFilename,
                id: account.pkey,
                summary: account?.summary,
                username: account.username
            });

            return successResponse({searchResults});
        }
    }

    let promises = [
        openSearchService.searchAccounts(searchQuery.query),
        openSearchService.searchTags(searchQuery.query),
        openSearchService.searchStatuses(searchQuery.query)
    ]

    let [accounts, tags, statuses] = await Promise.all(promises);

    searchResults.accounts.push(...accounts);
    searchResults.tags.push(...tags);
    searchResults.statuses.push(...statuses);

    return successResponse({searchResults});
});


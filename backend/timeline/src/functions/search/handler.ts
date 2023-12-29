import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {openSearchService} from "@libs/services";
import {successResponse} from "@libs/lambda/api-gateway";

interface SearchQuery {
    query: string
    type: string
}

export const searchTimeline = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    let searchQuery : SearchQuery = event.body as unknown as SearchQuery;
    let response: any;

    console.log(searchQuery);

    switch (searchQuery.type) {
        case "account":
            response = await openSearchService.searchAccounts(searchQuery.query);
            break;
        case "tag":
            response = await openSearchService.searchTags(searchQuery.query);
            break;
        case "status":
            response = await openSearchService.searchStatuses(searchQuery.query);
            break;
        default:
            console.error("I don't know how to handle this query");
            break;
    }

    return successResponse(response);
});


import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {successResponse} from "@libs/lambda/api-gateway";
import {searchService} from "@libs/services";
import {SearchResultsDto} from "@libs/dto/searchResultsDto";

interface SearchRequest {
    query: string
}

export const search = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    let searchRequest : SearchRequest = event.body as unknown as SearchRequest;
    let searchResults : SearchResultsDto = await searchService.search(searchRequest.query);

    return successResponse({searchResults});
});

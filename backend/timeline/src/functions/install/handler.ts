import {middyfy} from "@libs/lambda/lambda";
import {openSearchService} from "@libs/services";
import {successResponse} from "@libs/lambda/api-gateway";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";


export const createIndices = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    await openSearchService.createAccountIndex();
    await openSearchService.createStatusIndex();
    await openSearchService.createTagIndex();

    return successResponse({});
});

export const destroyIndices = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    await openSearchService.deleteAccountIndex();
    await openSearchService.deleteStatusIndex();
    await openSearchService.deleteTagIndex();

    return successResponse({});
});


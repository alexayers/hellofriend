import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {successResponse} from "@libs/lambda/api-gateway";


export const explorePosts = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    return successResponse({});
});

export const exploreTags = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    return successResponse({});
});

export const exploreAccounts = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    return successResponse({});
});

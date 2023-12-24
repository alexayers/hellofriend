import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {successResponse} from "@libs/lambda/api-gateway";


export const search = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    return successResponse({});
});

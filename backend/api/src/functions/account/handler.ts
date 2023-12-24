import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {successResponse} from "@libs/lambda/api-gateway";


export const updateAccount = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log(event);
  //  let accountID : string = event.requestContext.authorizer.claims.sub;

    return successResponse({});
});

export const getBookmarks = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
  //  let accountID : string = event.requestContext.authorizer.claims.sub;

    return successResponse({});
});

export const getFavorites = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
  //  let accountID : string = event.requestContext.authorizer.claims.sub;

    return successResponse({});
});

export const followAccount = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
  //  let accountID : string = event.requestContext.authorizer.claims.sub;

    return successResponse({});
});

export const unFollowAccount = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
   // let accountID : string = event.requestContext.authorizer.claims.sub;

    return successResponse({});
});

export const getAccount = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);


    return successResponse({});
});

export const getStatuses = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    return successResponse({});
});


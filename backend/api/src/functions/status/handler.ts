import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {successResponse} from "@libs/lambda/api-gateway";
import {accountService, bookmarkService, favoriteService, statusService} from "@libs/services";


export const postStatus = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    return successResponse({});
});


export const getStatus = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let statusID: string = event.pathParameters.statusID
    let accountID : string = event.requestContext.authorizer.claims.sub;
    let status = await statusService.getStatus(accountID,statusID);

    return successResponse({status});
});

export const updateStatus = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    //let statusID: string = event.pathParameters.statusID

    return successResponse({});
});

export const deleteStatus = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    //let statusID: string = event.pathParameters.statusID;

    return successResponse({});
});

export const replyToStatus = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
   // let statusID: string = event.pathParameters.statusID

    return successResponse({});
});

export const favoriteStatus = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    let accountID : string = event.requestContext.authorizer.claims.sub;
    let statusID: string = event.pathParameters.statusID;
    await favoriteService.addFavorite(accountID, statusID);

    return successResponse({});
});

export const removeFavorite = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    let accountID : string = event.requestContext.authorizer.claims.sub;
    let statusID: string = event.pathParameters.statusID;
    await favoriteService.removeFavorite(accountID, statusID);

    return successResponse({});
});

export const bookmarkStatus = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let accountID : string = event.requestContext.authorizer.claims.sub;
    let statusID: string = event.pathParameters.statusID;
    await bookmarkService.addBookmark(accountID, statusID);

    return successResponse({});
});

export const removeBookmark = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    let accountID : string = event.requestContext.authorizer.claims.sub;
    let statusID: string = event.pathParameters.statusID;
    await bookmarkService.removeBookmark(accountID, statusID);

    return successResponse({});
});

export const pinStatus = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let accountID : string = event.requestContext.authorizer.claims.sub;
    let statusID: string = event.pathParameters.statusID;

    await accountService.pinStatus(accountID, statusID);

    return successResponse({});
});

export const unPinStatus = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let accountID : string = event.requestContext.authorizer.claims.sub;
    let statusID: string = event.pathParameters.statusID;

    await accountService.unpinStatus(accountID, statusID);
    return successResponse({});
});

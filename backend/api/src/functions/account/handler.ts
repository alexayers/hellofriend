import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {successResponse} from "@libs/lambda/api-gateway";
import {StatusDto} from "@libs/dto/statusDto";
import {accountService, bookmarkService, favoriteService, followService, statusService} from "@libs/services";
import {Account} from "@libs/model/account";
import {Status} from "@libs/model/status";


export const updateAccount = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log(event);
  //  let accountID : string = event.requestContext.authorizer.claims.sub;

    return successResponse({});
});

export const getBookmarks = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let accountID : string = event.requestContext.authorizer.claims.sub;
    let bookmarks: Array<StatusDto> = await bookmarkService.getBookmarks(accountID);

    return successResponse({bookmarks});
});

export const getFavorites = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let accountID : string = event.requestContext.authorizer.claims.sub;
    let favorites: Array<StatusDto> = await favoriteService.getFavorites(accountID);

    return successResponse({favorites});
});

export const followAccount = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let yourAccountID : string = event.requestContext.authorizer.claims.sub;
    let accountID : string = event.pathParameters.accountID;

    await followService.generateFollowRequest(yourAccountID, accountID);

    return successResponse({});
});

export const unFollowAccount = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let yourAccountID : string = event.requestContext.authorizer.claims.sub;
    let accountID : string = event.pathParameters.accountID;

    await followService.generateUnFollowRequest(yourAccountID, accountID);

    return successResponse({});
});

export const getAccount = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let accountID : string = event.pathParameters.accountID;
    let account : Account = await accountService.getById(accountID);
    delete account.privateKey;

    return successResponse({account});
});

export const getStatuses = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let accountID : string = event.pathParameters.accountID;

    let statuses : Array<Status> = await statusService.getStatusesByAccount(accountID);

    return successResponse({statuses});
});


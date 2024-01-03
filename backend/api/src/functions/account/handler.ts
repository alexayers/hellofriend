import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {notFoundResponse, successResponse} from "@libs/lambda/api-gateway";
import {accountService, bookmarkService, favoriteService, followService, statusService} from "@libs/services";
import {Account} from "@libs/model/account";
import {Status} from "@libs/model/status";
import {Bookmark} from "@libs/model/bookmark";
import {Favorite} from "@libs/model/favorite";
import {StatusDto} from "@libs/dto/statusDto";


export const updateAccount = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log(event);
    //  let accountID : string = event.requestContext.authorizer.claims.sub;

    return successResponse({});
});

export const getBookmarks = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let accountID: string = event.requestContext.authorizer.claims.sub;
    let bookmarks: Array<Bookmark> = await bookmarkService.getBookmarks(accountID);

    if (!bookmarks) {
        return notFoundResponse(`No bookmarks found`);
    }

    const pkeys = bookmarks.map(item => item.status.id);

    const [bookmarkedResults, favoritedResults] = await Promise.all([
        bookmarkService.areBookmarked(accountID, pkeys),
        favoriteService.areFavorited(accountID, pkeys)
    ]);

    let statusDtos: Array<StatusDto> = bookmarks.map((item, index) => {
        return {
            account: item.status.account,
            id: item.status.id,
            isBookmark: bookmarkedResults[index],
            isFavorite: favoritedResults[index],
            published: item.status.published,
            text: item.status.text,
            totalLikes: 0,
            uri: item.status.uri
        }
    });

    return successResponse({statuses: statusDtos});
});

export const getFavorites = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let accountID: string = event.requestContext.authorizer.claims.sub;
    let favorites: Array<Favorite> = await favoriteService.getFavorites(accountID);

    if (!favorites) {
        return notFoundResponse(`No favorites found`);
    }


    const pkeys = favorites.map(item => item.status.id);

    const [bookmarkedResults, favoritedResults] = await Promise.all([
        bookmarkService.areBookmarked(accountID, pkeys),
        favoriteService.areFavorited(accountID, pkeys)
    ]);

    let statusDtos: Array<StatusDto> = favorites.map((item, index) => {
        return {
            account: item.status.account,
            id: item.status.id,
            isBookmark: bookmarkedResults[index],
            isFavorite: favoritedResults[index],
            published: item.status.published,
            text: item.status.text,
            totalLikes: 0,
            uri: item.status.uri
        }
    });

    return successResponse({statuses: statusDtos});
});

export const followAccount = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let yourAccountID: string = event.requestContext.authorizer.claims.sub;
    let accountID: string = event.pathParameters.accountID;

    let account: Account = await accountService.getById(accountID);

    if (!account) {
        return notFoundResponse(`Unable to find an account with ID ${accountID}`);
    }

    await followService.generateFollowRequest(yourAccountID, accountID);

    return successResponse({});
});

export const unFollowAccount = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let yourAccountID: string = event.requestContext.authorizer.claims.sub;
    let accountID: string = event.pathParameters.accountID;

    let account: Account = await accountService.getById(accountID);

    if (!account) {
        return notFoundResponse(`Unable to find an account with ID ${accountID}`);
    }

    await followService.generateUnFollowRequest(yourAccountID, accountID);

    return successResponse({});
});

export const getAccount = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let accountID: string = event.pathParameters.accountID;



    let account: Account = await accountService.getByNormalizedUsernameDomain(accountID);

    if (!account) {
        return notFoundResponse(`Unable to find an account with ID ${accountID}`);
    } else {
        delete account.privateKey;
        return successResponse({account: account});
    }


});

export const getStatuses = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let accountID: string = event.pathParameters.accountID;
    let yourAccountID: string = event.requestContext.authorizer.claims.sub;
    let account: Account = await accountService.getById(accountID);

    if (!account) {
        return notFoundResponse(`Unable to find an account with ID ${accountID}`);
    }

    let statuses: Array<Status> = await statusService.getStatusesByAccount(accountID);

    if (!statuses) {
        return notFoundResponse(`No statuses found`);
    }

    const pkeys = statuses.map(item => item.pkey);

    const [bookmarkedResults, favoritedResults] = await Promise.all([
        bookmarkService.areBookmarked(yourAccountID, pkeys),
        favoriteService.areFavorited(yourAccountID, pkeys)
    ]);

    let statusDtos: Array<StatusDto> = statuses.map((item, index) => {
        return {
            account: item.account,
            id: item.pkey,
            isBookmark: bookmarkedResults[index],
            isFavorite: favoritedResults[index],
            published: item.published,
            text: item.content,
            totalLikes: 0,
            uri: item.uri
        }
    });

    return successResponse({statuses: statusDtos});
});


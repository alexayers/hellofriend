import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {notFoundResponse, successResponse} from "@libs/lambda/api-gateway";
import {accountService, bookmarkService, favoriteService, followService, statusService} from "@libs/services";
import {Account} from "@libs/model/account";
import {Status} from "@libs/model/status";
import {Bookmark} from "@libs/model/bookmark";
import {Favorite} from "@libs/model/favorite";


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

    const bookmarkAndFavoritePromises = bookmarks.map(item => Promise.all([
        favoriteService.isFavorited(accountID, item.status.id)
    ]));

    const bookmarkAndFavoriteResults = await Promise.all(bookmarkAndFavoritePromises);
    let results = bookmarks.map((item, index) => {

        const isFavorited = bookmarkAndFavoriteResults[index];

        return {
            account: item.status.account,
            id: item.status.id,
            isBookmark: true,
            isFavorite: isFavorited[0],
            published: item.status.published,
            text: item.status.text,
            totalLikes: 0,
            uri: item.status.uri
        }
    });

    return successResponse({results});
});

export const getFavorites = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let accountID: string = event.requestContext.authorizer.claims.sub;
    let favorites: Array<Favorite> = await favoriteService.getFavorites(accountID);

    if (!favorites) {
        return notFoundResponse(`No favorites found`);
    }

    const bookmarkAndFavoritePromises = favorites.map(item => Promise.all([
        bookmarkService.isBookmarked(accountID, item.status.id)]));

    const bookmarkAndFavoriteResults = await Promise.all(bookmarkAndFavoritePromises);
    let results = favorites.map((item, index) => {

        const isBookmarked = bookmarkAndFavoriteResults[index];

        return {
            account: item.status.account,
            id: item.status.id,
            isBookmark: isBookmarked[0],
            isFavorite: true,
            published: item.status.published,
            text: item.status.text,
            totalLikes: 0,
            uri: item.status.uri
        }
    });

    return successResponse({results});
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
    let account: Account = await accountService.getById(accountID);

    if (!account) {
        return notFoundResponse(`Unable to find an account with ID ${accountID}`);
    } else {
        delete account.privateKey;
        return successResponse({account});
    }


});

export const getStatuses = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let accountID: string = event.pathParameters.accountID;
    let account: Account = await accountService.getById(accountID);

    if (!account) {
        return notFoundResponse(`Unable to find an account with ID ${accountID}`);
    }

    let statuses: Array<Status> = await statusService.getStatusesByAccount(accountID);

    if (!statuses) {
        return notFoundResponse(`No statuses found`);
    }

    const bookmarkAndFavoritePromises = statuses.map(item => Promise.all([
        bookmarkService.isBookmarked(accountID, item.pkey),
        favoriteService.isFavorited(accountID, item.pkey)
    ]));

    const bookmarkAndFavoriteResults = await Promise.all(bookmarkAndFavoritePromises);
    let results = statuses.map((item, index) => {

        const [isBookmarked, isFavorites] = bookmarkAndFavoriteResults[index];

        return {
            account: item.account,
            id: item.pkey,
            isBookmark: isBookmarked,
            isFavorite: isFavorites,
            published: item.published,
            text: item.content,
            totalLikes: 0,
            uri: item.uri
        }
    });

    return successResponse({results});
});


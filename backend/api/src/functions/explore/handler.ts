import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {successResponse} from "@libs/lambda/api-gateway";
import {bookmarkService, favoriteService, timeSeriesService} from "@libs/services";

export const exploreStatuses = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    let accountID : string = event.requestContext.authorizer.claims.sub;
    let results = await timeSeriesService.getRecent("Status");
    const pkeys = results.map(item => item.pkey);

    const [bookmarkedResults, favoritedResults] = await Promise.all([
        bookmarkService.areBookmarked(accountID, pkeys),
        favoriteService.areFavorited(accountID, pkeys)
    ]);

    results = results.map((item, index) => {
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

    return successResponse({statuses:results});
});

export const exploreTags = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    let results = await timeSeriesService.getRecent("Tag");
    results = results.map(item => {
        return {
            tag: item.pkey,
            created: item.createdAt
        };
    });

    return successResponse({tags:results});
});

export const exploreAccounts = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    let results = await timeSeriesService.getRecent("Account" );

    results = results.map(item =>{
       return {
           displayName: item.displayName,
           headerFilename: item?.headerFilename,
           id: item.pkey,
           summary: item?.summary,
           uri: item.uri,
           avatarFilename: item?.avatarFilename,
           username: item.username,
           created: item.createdAt
       }
    });

    return successResponse({accounts:results});
});

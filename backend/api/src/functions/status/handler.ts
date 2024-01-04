import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {notFoundResponse, successResponse} from "@libs/lambda/api-gateway";
import {accountService, bookmarkService, favoriteService, statusService} from "@libs/services";
import {StatusDto} from "@libs/dto/statusDto";
import {Favorite} from "@libs/model/favorite";
import {Bookmark} from "@libs/model/bookmark";

export const postStatus = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    return successResponse({});
});


export const getStatus = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let statusID: string = event.pathParameters.statusID
    let accountID: string = event.requestContext.authorizer.claims.sub;
    let status: StatusDto = await statusService.getStatus(accountID, statusID);

    if (status) {
        return successResponse({status: status});
    } else {
        return notFoundResponse(`Unable to find a status for ${statusID}`);
    }


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

    let accountID: string = event.requestContext.authorizer.claims.sub;
    let statusID: string = event.pathParameters.statusID;
    let favorite: Favorite = await favoriteService.addFavorite(accountID, statusID);

    if (favorite) {
        return successResponse({favorite});
    } else {
        return notFoundResponse(`Unable to find a status for ${statusID}`);
    }

});

export const removeFavorite = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    let accountID: string = event.requestContext.authorizer.claims.sub;
    let statusID: string = event.pathParameters.statusID;
    let removed: boolean = await favoriteService.removeFavorite(accountID, statusID);

    if (removed) {
        return successResponse({removed});
    } else {
        return notFoundResponse(`Unable to find a status for ${statusID}`);
    }

});

export const bookmarkStatus = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let accountID: string = event.requestContext.authorizer.claims.sub;
    let statusID: string = event.pathParameters.statusID;
    let bookmark: Bookmark = await bookmarkService.addBookmark(accountID, statusID);

    if (bookmark) {
        return successResponse({bookmark});
    } else {
        return notFoundResponse(`Unable to find a status for ${statusID}`);
    }


});

export const removeBookmark = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    let accountID: string = event.requestContext.authorizer.claims.sub;
    let statusID: string = event.pathParameters.statusID;
    let removed: boolean = await bookmarkService.removeBookmark(accountID, statusID);

    if (removed) {
        return successResponse({removed});
    } else {
        return notFoundResponse(`Unable to find a status for ${statusID}`);
    }

});

export const pinStatus = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let accountID: string = event.requestContext.authorizer.claims.sub;
    let statusID: string = event.pathParameters.statusID;

    let pinned: boolean = await accountService.pinStatus(accountID, statusID);

    if (pinned) {
        return successResponse({pinned});
    } else {
        return notFoundResponse(`Unable to find a status for ${statusID}`);
    }

});

export const unPinStatus = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let accountID: string = event.requestContext.authorizer.claims.sub;
    let statusID: string = event.pathParameters.statusID;

    let unpinned: boolean = await accountService.unpinStatus(accountID, statusID);

    if (unpinned) {
        return successResponse({unpinned});
    } else {
        return notFoundResponse(`Unable to find a status for ${statusID}`);
    }

});

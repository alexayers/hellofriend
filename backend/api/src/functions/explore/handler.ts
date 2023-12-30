import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {successResponse} from "@libs/lambda/api-gateway";
import {timeSeriesService} from "@libs/services";


export const exploreStatuses = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    let results = await timeSeriesService.getRecent("Status");


    return successResponse({results});
});

export const exploreTags = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    let results = await timeSeriesService.getRecent("Tag");
    results = results.map(item => {
        return { tag: item.pkey };
    });

    return successResponse({results});
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
           username: item.username
       }
    });

    return successResponse({results});
});

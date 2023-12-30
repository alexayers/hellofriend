import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {successResponse} from "@libs/lambda/api-gateway";
import {accountService, timeSeriesService} from "@libs/services";
import {Account} from "@libs/model/account";


export const exploreStatuses = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    let results = await timeSeriesService.getRecent("Status");
    const accountPromises = results.map(item => accountService.getById(item.accountId));
    const accounts = await Promise.all(accountPromises);

    results = results.map((item, index) => {
        const account: Account = accounts[index];

        return {
            conversationId: item.conversationId,
            language: item.language,
            published: item.published,
            sensitive: item.sensitive,
            uri: item.uri,
            content: item.content,
            url: item.url,
            account: {
                id: item.accountId,
                displayName: account.displayName,
                username: account.username,
                uri: account.uri,
                domain: account.domain ? account.domain : process.env.DOMAIN,
                avatarFilename: account.avatarFilename ? account.avatarFilename : null,
                headerFilename: account.headerFilename ? account.headerFilename : null,
            },
            id: item.pkey
        };
    });


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

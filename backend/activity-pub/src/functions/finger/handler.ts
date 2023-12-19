import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {middyfy} from "@libs/lambda/lambda";
import {Account} from "@libs/model/account";
import {accountService, fediverseService} from "@libs/services";
import {notFoundResponse, notValidResponse, successResponse} from "@libs/lambda/api-gateway";


export const webFinger = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log(event);
    let account: Account = await accountService.getByNormalizedUsernameDomain(event.pathParameters.user);

    if (!account) {
        console.error("User not found");
        return notFoundResponse("User not found");
    }

    return successResponse({
        subject: `acct:${account.username}@${process.env.DOMAIN}`,
        aliases: [
            `https://www.${process.env.DOMAIN}/@${account.username}`,
            `https://www.${process.env.DOMAIN}/users/${account.username}`
        ],
        links: [
            {
                rel: "http://webfinger.net/rel/profile-page",
                type: "text/html",
                href: `https://www.${process.env.DOMAIN}/@${account.username}`
            },
            {
                rel: "self",
                type: "application/activity+json",
                href: `https://www.${process.env.DOMAIN}/users/${account.username}`
            },
            {
                rel: "http://ostatus.org/schema/1.0/subscribe",
                template: `https://www.${process.env.DOMAIN}/authorize_interaction?uri={uri}`
            },
            {
                rel: "http://webfinger.net/rel/avatar",
                type: "image/png",
                href: `https://files.${process.env.DOMAIN}/${account.avatarFilename}`
            }
        ]
    });
});

export const webFingerRemote = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    let userTokens: string [] = event.pathParameters.user.split("@");
    let filteredArray: string [] = userTokens.filter(element => element !== '');

    if (filteredArray.length != 2) {
        return notValidResponse(`Your request for ${event.pathParameters.user} isn't valid`);
    }

    let webFingerUrl: string = `https://${filteredArray[1]}/.well-known/webfinger?resource=acct:${filteredArray[0]}@${filteredArray[1]}`;
    console.debug(`WebFinger: ${webFingerUrl}`);

    let response = await fediverseService.signedRequest("get", webFingerUrl);

    return successResponse(response);
});


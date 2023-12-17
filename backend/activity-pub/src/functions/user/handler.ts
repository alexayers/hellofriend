import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {Account} from "@libs/model/account";
import {accountService} from "@libs/services";
import {returnNotFound, successResponse} from "@libs/lambda/api-gateway";


export const getUser = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    let user: string = event.pathParameters.user;
    let account: Account;

    if (user.includes("@")) {
        let userTokens: string [] = user.split("@");
        account = await accountService.getByNormalizedUsernameDomain(userTokens[0], userTokens[1]);
    } else {
        account = await accountService.getByNormalizedUsernameDomain(user);
    }

    if (!account) {
        console.error(`User ${user} not found`);
        return returnNotFound("User not found")
    }

    return successResponse({
        "id": `https://www.${process.env.DOMAIN}/users/${user}`,
        "type": "Person",
        "name": account.displayName,
        "icon": {
            "type": "Image",
            "url": account.avatarFilename,
            "mediaType": "image/png"
        },
        "image": {
            "type": "Image",
            "url": account.headerFilename,
            "mediaType": "image/png"
        },
        "summary": account.summary,
        "url": `https://www.${process.env.DOMAIN}/@${user}`,
        "following": `https://api.${process.env.DOMAIN}/users/${user}/following`,
        "followers": `https://api.${process.env.DOMAIN}/users/${user}/followers`,
        "inbox": `https://api.${process.env.DOMAIN}/users/${user}/inbox`,
        "outbox": `https://api.${process.env.DOMAIN}/users/${user}/outbox`,
        "featured": `https://api.${process.env.DOMAIN}/users/${user}/collections/featured`,
        "featuredTags": `https://api.${process.env.DOMAIN}/users/${user}/collections/tags`,
        "endpoints": {
            "sharedInbox": `https://api.${process.env.DOMAIN}/inbox`
        },
        "preferredUsername": account.username,
        "manuallyApprovesFollowers": false,
        "discoverable": account.discoverable,
        "indexable": account.indexable,
        "memorial": account.memorial,
        "publicKey": {
            "id": `https://www.${process.env.DOMAIN}/users/${user}#main-key`,
            "owner": `https://www.${process.env.DOMAIN}/users/${user}`,
            "publicKeyPem": account.publicKey
        },
        "@context": [
            "https://www.w3.org/ns/activitystreams",
            "https://w3id.org/security/v1"
        ]
    });

});

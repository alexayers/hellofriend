import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {Account} from "@libs/model/account";
import {accountService, followService, inboxSerivce} from "@libs/services";
import {notAuthenticatedResponse, notFoundResponse, successResponse} from "@libs/lambda/api-gateway";
import {ValidationStatus} from "@libs/services/inboxService";
import {Activity, ActivityType, FollowActivity} from "@libs/activityPub/activity/activities";


export const getUser = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


    let user: string = event.pathParameters.user;
    let account: Account;
    console.log(event);

    if (user.includes("@")) {
        let userTokens: string [] = user.split("@");
        account = await accountService.getByNormalizedUsernameDomain(userTokens[0], userTokens[1]);
    } else {
        account = await accountService.getByNormalizedUsernameDomain(user);
    }

    if (!account) {
        console.error(`User ${user} not found`);
        return notFoundResponse("User not found")
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
        "following": `https://api.${process.env.DOMAIN}/activitypub/users/${user}/following`,
        "followers": `https://api.${process.env.DOMAIN}/activitypub/users/${user}/followers`,
        "inbox": `https://api.${process.env.DOMAIN}/activitypub/users/${user}/inbox`,
        "outbox": `https://api.${process.env.DOMAIN}/activitypub/users/${user}/outbox`,
        "featured": `https://api.${process.env.DOMAIN}/activitypub/users/${user}/collections/featured`,
        "featuredTags": `https://api.${process.env.DOMAIN}/activitypub/users/${user}/collections/tags`,
        "endpoints": {
            "sharedInbox": `https://api.${process.env.DOMAIN}/activitypub/inbox`
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


export const personalInbox = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    let account : Account = await accountService.getByNormalizedUsernameDomain(event.pathParameters.user);

    if (!account) {
        return notFoundResponse( "Requested user's inbox is not found");
    }

    let validationStatus : ValidationStatus = await inboxSerivce.validateRequest(`/activitypub/users/${account.username}/inbox`,event.headers);

    if (validationStatus != ValidationStatus.VALID) {
        return notAuthenticatedResponse("Unable to validate request")
    }

    let activity : Activity = event.body as unknown as Activity;

    switch (activity.type) {
        case ActivityType.Follow:
            await followService.acceptRequest(event.body as unknown as FollowActivity)
            break;
        default:
            console.warn(`I don't know what to do with Activity Type: ${activity.type}`)
    }

    return successResponse({"Success": true});

});

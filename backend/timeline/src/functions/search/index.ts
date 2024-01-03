import {handlerPath} from "@libs/lambda/handler-resolver";

export const searchTimeline = {
    handler: `${handlerPath(__dirname)}/handler.searchTimeline`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'post',
                path: '/search',
                cors: true,
                authorizer: {
                    type: 'COGNITO_USER_POOLS',
                    authorizerId: {
                        "Ref": "CognitoUserPoolAuthorizer"
                    },
                },
            },
        },
    ],
};

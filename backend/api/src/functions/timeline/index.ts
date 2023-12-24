import {handlerPath} from "@libs/lambda/handler-resolver";



export const getTimeline = {
    handler: `${handlerPath(__dirname)}/handler.getTimeline`,
    memorySize: 128,
    events: [
        {
            http: {
                method: 'get',
                path: '/timeline/statuses',
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

export const getTimelineByTag = {
    handler: `${handlerPath(__dirname)}/handler.getTimelineByTag`,
    memorySize: 128,
    events: [
        {
            http: {
                method: 'get',
                path: '/timeline/tags',
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

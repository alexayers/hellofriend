import {handlerPath} from "@libs/lambda/handler-resolver";


export const exploreStatuses = {
    handler: `${handlerPath(__dirname)}/handler.exploreStatuses`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'get',
                path: '/explore/statuses',
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


export const exploreTags = {
    handler: `${handlerPath(__dirname)}/handler.exploreTags`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'get',
                path: '/explore/tags',
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

export const exploreAccounts = {
    handler: `${handlerPath(__dirname)}/handler.exploreAccounts`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'get',
                path: '/explore/accounts',
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

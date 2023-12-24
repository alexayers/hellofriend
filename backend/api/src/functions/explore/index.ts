import {handlerPath} from "@libs/lambda/handler-resolver";



export const explorePosts = {
    handler: `${handlerPath(__dirname)}/handler.explorePosts`,
    memorySize: 128,
    events: [
        {
            http: {
                method: 'get',
                path: '/explore/posts',
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
    events: [
        {
            http: {
                method: 'get',
                path: '/explore/tags',
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
    events: [
        {
            http: {
                method: 'get',
                path: '/explore/accounts',
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

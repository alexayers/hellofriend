import {handlerPath} from "@libs/lambda/handler-resolver";

export const updateAccount = {
    handler: `${handlerPath(__dirname)}/handler.updateAccount`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'put',
                path: '/account',
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


export const getBookmarks = {
    handler: `${handlerPath(__dirname)}/handler.getBookmarks`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'get',
                path: '/account/bookmarks',
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

export const getFavorites = {
    handler: `${handlerPath(__dirname)}/handler.getFavorites`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'get',
                path: '/account/favorites',
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

export const followAccount = {
    handler: `${handlerPath(__dirname)}/handler.followAccount`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'post',
                path: '/accounts/{accountID}/follow',
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

export const unFollowAccount = {
    handler: `${handlerPath(__dirname)}/handler.unFollowAccount`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'delete',
                path: '/accounts/{accountID}/follow',
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

export const getAccount = {
    handler: `${handlerPath(__dirname)}/handler.getAccount`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'get',
                path: `/accounts/{accountID}`,
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

export const getStatuses = {
    handler: `${handlerPath(__dirname)}/handler.getStatuses`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'get',
                path: '/accounts/{accountID}/statuses',
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

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

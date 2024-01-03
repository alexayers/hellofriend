import {handlerPath} from "@libs/lambda/handler-resolver";


export const postStatus = {
    handler: `${handlerPath(__dirname)}/handler.postStatus`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'post',
                path: '/status',
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

export const getStatus = {
    handler: `${handlerPath(__dirname)}/handler.getStatus`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'get',
                path: '/statuses/{statusID}',
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

export const updateStatus = {
    handler: `${handlerPath(__dirname)}/handler.updateStatus`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'put',
                path: '/statuses/{statusID}',
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

export const deleteStatus = {
    handler: `${handlerPath(__dirname)}/handler.deleteStatus`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'delete',
                path: '/statuses/{statusID}',
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

export const replyToStatus = {
    handler: `${handlerPath(__dirname)}/handler.replyToStatus`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'post',
                path: '/statuses/{statusID}/reply',
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

export const favoriteStatus = {
    handler: `${handlerPath(__dirname)}/handler.favoriteStatus`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'post',
                path: '/statuses/{statusID}/favorite',
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

export const removeFavorite = {
    handler: `${handlerPath(__dirname)}/handler.removeFavorite`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'delete',
                path: '/statuses/{statusID}/favorite',
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

export const bookmarkStatus = {
    handler: `${handlerPath(__dirname)}/handler.bookmarkStatus`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'post',
                path: '/statuses/{statusID}/bookmark',
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

export const removeBookmark = {
    handler: `${handlerPath(__dirname)}/handler.removeBookmark`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'delete',
                path: '/statuses/{statusID}/bookmark',
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

export const pinStatus = {
    handler: `${handlerPath(__dirname)}/handler.pinStatus`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'post',
                path: '/statuses/{statusID}/pin',
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

export const unPinStatus = {
    handler: `${handlerPath(__dirname)}/handler.unPinStatus`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'delete',
                path: '/statuses/{statusID}/pin',
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

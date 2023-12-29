import {handlerPath} from "@libs/lambda/handler-resolver";


export const createIndices = {
    handler: `${handlerPath(__dirname)}/handler.createIndices`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'post',
                path: '/search/indices',
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


export const destroyIndices = {
    handler: `${handlerPath(__dirname)}/handler.destroyIndices`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'delete',
                path: '/search/indices',
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

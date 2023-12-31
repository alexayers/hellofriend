import {handlerPath} from "@libs/lambda/handler-resolver";


export const getStatusesByTag = {
    handler: `${handlerPath(__dirname)}/handler.tags`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'get',
                path: '/tags/{tag}',
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

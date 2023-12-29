import {handlerPath} from "@libs/lambda/handler-resolver";


export const search = {
    handler: `${handlerPath(__dirname)}/handler.search`,
    memorySize: 512,
    timeout: 30,
    events: [
        {
            http: {
                method: 'post',
                path: '/search',
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

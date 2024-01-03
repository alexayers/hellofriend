import {handlerPath} from "@libs/lambda/handler-resolver";

export const register = {
    handler: `${handlerPath(__dirname)}/handler.register`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            http: {
                method: 'post',
                path: '/auth/register',
                cors: true
            },
        },
    ],
};

export const login = {
    handler: `${handlerPath(__dirname)}/handler.login`,
    memorySize: 512,
    timeout: 30,
    events: [
        {
            http: {
                method: 'post',
                path: '/auth/login',
                cors: true
            },
        },
    ],
};

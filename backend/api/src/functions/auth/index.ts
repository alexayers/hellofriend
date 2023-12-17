import {handlerPath} from "@libs/lambda/handler-resolver";


export const register = {
    handler: `${handlerPath(__dirname)}/handler.register`,
    events: [
        {
            http: {
                method: 'post',
                path: '/auth/register',
            },
        },
    ],
};

export const login = {
    handler: `${handlerPath(__dirname)}/handler.login`,
    events: [
        {
            http: {
                method: 'post',
                path: '/auth/login',
            },
        },
    ],
};

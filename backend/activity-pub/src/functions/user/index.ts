import {handlerPath} from "@libs/lambda/handler-resolver";


export const getUser = {
    handler: `${handlerPath(__dirname)}/handler.getUser`,
    memorySize: 128,
    events: [
        {
            http: {
                method: 'get',
                path: '/users/{user}',
                cors: true
            },
        },
    ],
};

export const postPersonalInbox = {
    handler: `${handlerPath(__dirname)}/handler.personalInbox`,
    memorySize: 512,
    events: [
        {
            http: {
                method: 'post',
                path: '/users/{user}/inbox',
            },
        },
    ],
};

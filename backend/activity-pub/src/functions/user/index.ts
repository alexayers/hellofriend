import {handlerPath} from "@libs/lambda/handler-resolver";


export const getUser = {
    handler: `${handlerPath(__dirname)}/handler.getUser`,
    memorySize: 128,
    events: [
        {
            http: {
                method: 'get',
                path: '/users/{user}',
            },
        },
    ],
};

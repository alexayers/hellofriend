import {handlerPath} from "@libs/lambda/handler-resolver";


export const webFinger = {
    handler: `${handlerPath(__dirname)}/handler.webFinger`,
    memorySize: 128,
    events: [
        {
            http: {
                method: 'get',
                path: '/webfinger/{user}',
            },
        }
    ],
};

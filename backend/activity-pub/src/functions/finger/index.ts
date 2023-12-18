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

export const webFingerRemote = {
    handler: `${handlerPath(__dirname)}/handler.webFingerRemote`,
    memorySize: 128,
    events: [
        {
            http: {
                method: 'post',
                path: '/webfinger/{user}',
            },
        }
    ],
};

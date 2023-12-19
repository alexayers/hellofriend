import {handlerPath} from "@libs/lambda/handler-resolver";


export const postSharedInbox = {
    handler: `${handlerPath(__dirname)}/handler.sharedInbox`,
    memorySize: 512,
    events: [
        {
            http: {
                method: 'post',
                path: '/inbox',
            },
        },
    ],
};



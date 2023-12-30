import {handlerPath} from "@libs/lambda/handler-resolver";
import configuration from "../../../../configuration";


export const dynamoDbStreamStatusesTimelineProcessor = {
    handler: `${handlerPath(__dirname)}/handler.dynamoDbStreamStatusesTimelineProcessor`,
    memorySize: 512,
    timeout: 120,
    events: [
        {
            stream: {
                type: 'dynamodb',
                arn: {
                    'Fn::ImportValue': `${configuration.resourcePrefix}-StatusesTableStreamArn`
                },
                batchSize: 10,
                startingPosition: 'LATEST',
            },
        },
    ],
};

export const dynamoDbStreamStatusesTagTimelineProcessor = {
    handler: `${handlerPath(__dirname)}/handler.dynamoDbStreamStatusesTagTimelineProcessor`,
    memorySize: 512,
    timeout: 120,
    events: [
        {
            stream: {
                type: 'dynamodb',
                arn: {
                    'Fn::ImportValue': `${configuration.resourcePrefix}-StatusesTableStreamArn`
                },
                batchSize: 10,
                startingPosition: 'LATEST',
            },
        },
    ],
};

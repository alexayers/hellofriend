import {handlerPath} from "@libs/lambda/handler-resolver";
import configuration from "../../../../configuration";

export const dynamoDbStreamAccountsProcessor = {
    handler: `${handlerPath(__dirname)}/handler.dynamoDbStreamAccountsProcessor`,
    memorySize: 128,
    events: [
        {
            stream: {
                type: 'dynamodb',
                arn: {
                    'Fn::ImportValue': `${configuration.resourcePrefix}-AccountsTableStreamArn`
                },
                batchSize: 100,
                startingPosition: 'LATEST',
            },
        },
    ],
};

export const dynamoDbStreamTagsProcessor = {
    handler: `${handlerPath(__dirname)}/handler.dynamoDbStreamTagsProcessor`,
    memorySize: 128,
    events: [
        {
            stream: {
                type: 'dynamodb',
                arn: {
                    'Fn::ImportValue': `${configuration.resourcePrefix}-TagsTableStreamArn`
                },
                batchSize: 100,
                startingPosition: 'LATEST',
            },
        },
    ],
};

export const dynamoDbStreamStatusesProcessor = {
    handler: `${handlerPath(__dirname)}/handler.dynamoDbStreamStatusesProcessor`,
    memorySize: 128,
    events: [
        {
            stream: {
                type: 'dynamodb',
                arn: {
                    'Fn::ImportValue': `${configuration.resourcePrefix}-StatusesTableStreamArn`
                },
                batchSize: 100,
                startingPosition: 'LATEST',
            },
        },
    ],
};

import {handlerPath} from "@libs/lambda/handler-resolver";
import configuration from "../../../../configuration";

export const dynamoDbStreamAccountsProcessor = {
    handler: `${handlerPath(__dirname)}/handler.dynamoDbStreamAccountsProcessor`,
    memorySize: 512,
    timeout:120,
    events: [
        {
            stream: {
                type: 'dynamodb',
                arn: {
                    'Fn::ImportValue': `${configuration.resourcePrefix}-AccountsTableStreamArn`
                },
                batchSize: 10,
                startingPosition: 'LATEST',
            },
        },
    ],
};

export const dynamoDbStreamTagsProcessor = {
    handler: `${handlerPath(__dirname)}/handler.dynamoDbStreamTagsProcessor`,
    memorySize: 512,
    timeout:240,
    events: [
        {
            stream: {
                type: 'dynamodb',
                arn: {
                    'Fn::ImportValue': `${configuration.resourcePrefix}-TagsTableStreamArn`
                },
                batchSize: 10,
                startingPosition: 'LATEST',
            },
        },
    ],
};

export const dynamoDbStreamStatusesProcessor = {
    handler: `${handlerPath(__dirname)}/handler.dynamoDbStreamStatusesProcessor`,
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

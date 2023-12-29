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

/*
(async() =>{
    console.log("Creating indices if needed...");
    const endpoint:string = process.env.OPENSEARCH_ENDPOINT;
    console.log(`Verifying existence of Index account-index on node: ${endpoint}`);

    // Check if the index exists
    const existsResponse = await fetch(`${endpoint}/account-index`, { method: 'HEAD' });
    if (!existsResponse.ok) {

        const createResponse = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mappings: {
                    properties: {
                        id: { type: 'keyword' },
                        username: { type: 'text' },
                        displayName: { type: 'text' },
                        summary: { type: 'text' }
                    }
                }
            })
        });

        if (createResponse.ok) {
            console.log(`Index account created`);
        } else {
            console.error('Error creating index:', await createResponse.text());
        }


    } else {
        console.log(`Index account-index already exists`);
    }


})();*/


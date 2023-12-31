import {unmarshall} from "@aws-sdk/util-dynamodb";
import {accountService, openSearchService} from "@libs/services";
import {Account} from "@libs/model/account";
import {Tag} from "@libs/model/tag";
import {Status} from "@libs/model/status";
import * as console from "console";


export const dynamoDbStreamAccountsProcessor = async (event: { Records: any; }) => {
    console.log("Processing DynamoDB Accounts Stream event", event);

    for (const record of event.Records) {
        console.log("Record: ", record);

        if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
            const newImage = unmarshall(record.dynamodb.NewImage);
            console.log("New Image:", newImage);

            const account : Account = newImage as unknown as Account;

            await openSearchService.storeAccount({
                id: account.pkey,
                displayName: account.displayName,
                summary: account?.summary,
                username: account.username,
                avatarFilename: account?.avatarFilename,
                domain: account.domain,
                headerFilename: account?.headerFilename,
            });
        }
    }

};

export const dynamoDbStreamTagsProcessor = async (event: { Records: any; }) => {
    console.log("Processing DynamoDB Tags Stream event", event);

    for (const record of event.Records) {
        console.log("Record: ", record);

        if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
            const newImage = unmarshall(record.dynamodb.NewImage);
            console.log("New Image:", newImage);

            const tag : Tag = newImage as unknown as Tag;

            await openSearchService.storeTag({
                id: tag.pkey,
                tag: tag.pkey
            });
        }
    }

};

export const dynamoDbStreamStatusesProcessor = async (event: { Records: any; }) => {
    console.log("Processing DynamoDB Statuses Stream event", event);

    for (const record of event.Records) {
        console.log("Record: ", record);

        if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
            const newImage = unmarshall(record.dynamodb.NewImage);
            console.log("New Image:", newImage);

            if (newImage.objectName != "Status") {
                continue;
            }

            let status: Status = newImage as unknown as Status;

            let account : Account = await accountService.getById(status.accountId);

            await openSearchService.storeStatus({
                id: status.pkey,
                status: status?.content,
                accountId : account.pkey,
                uri: status.uri,
                avatarFilename: account?.avatarFilename,
                displayName: account.displayName,
                domain: account?.domain,
                username: account.username,
                published: status.published,
                language: status.language
            });
        }
    }

};


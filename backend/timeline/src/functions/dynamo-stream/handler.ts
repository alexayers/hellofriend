import {unmarshall} from "@aws-sdk/util-dynamodb";
import {openSearchService} from "@libs/services";


export const dynamoDbStreamAccountsProcessor = async (event: { Records: any; }) => {
    console.log("Processing DynamoDB Accounts Stream event", event);

    await openSearchService.createAccountIndex();

    for (const record of event.Records) {
        console.log("Record: ", record);

        if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
            const newImage = unmarshall(record.dynamodb.NewImage);
            console.log("New Image:", newImage);

            await openSearchService.storeAccount({
                id: "",
                displayName: "",
                summary: "",
                username: ""

            });
        }
    }

};

export const dynamoDbStreamTagsProcessor = async (event: { Records: any; }) => {
    console.log("Processing DynamoDB Tags Stream event", event);

    await openSearchService.createTagIndex();

    for (const record of event.Records) {
        console.log("Record: ", record);

        if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
            const newImage = unmarshall(record.dynamodb.NewImage);
            console.log("New Image:", newImage);

            await openSearchService.storeTag({
                id: "",
                tag: ""
            });
        }
    }

};

export const dynamoDbStreamStatusesProcessor = async (event: { Records: any; }) => {
    console.log("Processing DynamoDB Statuses Stream event", event);

    await openSearchService.createStatusIndex();

    for (const record of event.Records) {
        console.log("Record: ", record);

        if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
            const newImage = unmarshall(record.dynamodb.NewImage);
            console.log("New Image:", newImage);
            await openSearchService.storeStatus({
                id: "",
                status: ""
            });
        }
    }

};


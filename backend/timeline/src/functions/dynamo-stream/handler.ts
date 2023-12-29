import {unmarshall} from "@aws-sdk/util-dynamodb";


export const dynamoDbStreamAccountsProcessor = async (event: { Records: any; }) => {
    console.log("Processing DynamoDB Accounts Stream event", event);

    for (const record of event.Records) {
        console.log("Record: ", record);

        if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
            const newImage = unmarshall(record.dynamodb.NewImage);
            console.log("New Image:", newImage);
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
        }
    }

};

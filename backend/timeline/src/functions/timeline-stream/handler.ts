import {accountService, openSearchService, statusService, timelineService} from "@libs/services";
import console from "console";
import {unmarshall} from "@aws-sdk/util-dynamodb";
import {Status} from "@libs/model/status";
import {Account} from "@libs/model/account";
import {Tag} from "@libs/model/tag";


export const dynamoDbStreamStatusesTimelineProcessor = async (event: { Records: any; }) => {
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

            await timelineService.process(
                {
                    account: account,
                    expiresAt: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
                    objectName: "TimelineStatus",
                    pkey: getCurrentDateFormatted(new Date(account.createdAt)),
                    status: status}
            );
        }
    }

};



function getCurrentDateFormatted(now: Date) {
    const year: number = now.getFullYear();
    const month: string = String(now.getMonth() + 1).padStart(2, '0');
    const day: string = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`; // Format and return the date as YYYY-MM-DD
}

import {SQSEvent} from "aws-lambda";
import {timelineQueueService, timelineService} from "@libs/services";
import {TimeLineEntry} from "@libs/model/timeLineEntry";


export const timelineQueueProcessor = async (event: SQSEvent) => {
    for (const message of event.Records) {

        console.log(message);

        let accountStatus : TimeLineEntry = message as unknown as TimeLineEntry;
        await timelineService.process(accountStatus);


        await timelineQueueService.deleteMessage(message.receiptHandle);
    }
}

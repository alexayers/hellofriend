import {handlerPath} from "@libs/lambda/handler-resolver";
import configuration from "../../../../configuration";


export const timelineQueueProcessor = {
    handler: `${handlerPath(__dirname)}/handler.timelineQueueProcessor`,
    memorySize: 128,
    timeout: 30,
    events: [
        {
            sqs: {
                arn: {
                    "Fn::ImportValue":  `${configuration.resourcePrefix}-TimelineQueueArn`},
                batchSize: 10
            },
        }
    ],
};

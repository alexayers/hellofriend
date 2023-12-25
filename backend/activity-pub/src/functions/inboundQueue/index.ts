import {handlerPath} from "@libs/lambda/handler-resolver";
import configuration from "../../../../configuration"
export const inboundQueueProcessor = {
    handler: `${handlerPath(__dirname)}/handler.inboundQueueProcessor`,
    memorySize: 128,
    timeout: 90,
    events: [
        {
            sqs: {
                arn: {
                    "Fn::ImportValue":  `${configuration.resourcePrefix}-InboundQueueArn`},
                batchSize: 10
            },
        }
    ],
};

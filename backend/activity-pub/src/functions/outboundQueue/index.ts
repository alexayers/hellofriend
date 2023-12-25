import {handlerPath} from "@libs/lambda/handler-resolver";
import configuration from "../../../../configuration"
export const outboundQueueProcessor = {
    handler: `${handlerPath(__dirname)}/handler.outboundQueueProcessor`,
    memorySize: 128,
    timeout: 90,
    events: [
        {
            sqs: {
                arn: {
                    "Fn::ImportValue":  `${configuration.resourcePrefix}-OutboundQueueArn`},
                batchSize: 10
            },
        }
    ],
};

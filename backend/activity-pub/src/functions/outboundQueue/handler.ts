import {SQSEvent} from "aws-lambda";
import {Activity, ActivityType, FollowActivity, UndoFollowActivity} from "@libs/activityPub/activity/activities";
import {followService, outboundQueueService} from "@libs/services";

/*
    This queue will handle data headed out of your instance and outwards into the Fediverse
 */

export const outboundQueueProcessor = async (event: SQSEvent) => {
    for (const message of event.Records) {
        try {

            try {
                const activity: Activity = JSON.parse(message.body) as Activity;
                console.log('Processing message:', activity);

                switch (activity.type) {
                    case ActivityType.Follow:
                        await followService.sendFollowRequest(activity as FollowActivity);
                        break;
                    case ActivityType.Undo:

                        await followService.sendUnFollowRequest(activity as UndoFollowActivity);

                        break;

                    default:
                        console.warn(`I don't know how to handle ${activity.type}`);
                        break;
                }

                await outboundQueueService.deleteMessage(message.receiptHandle);
            } catch (error) {
                console.error('Error processing message:', message.messageId, error);
            }



        } catch (error) {
            console.error('Error processing message:', message.messageId, error);

        }
    }

};

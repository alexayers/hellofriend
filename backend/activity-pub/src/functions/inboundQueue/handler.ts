import {SQSEvent} from "aws-lambda";
import {Activity, ActivityType, CreateActivity, FollowActivity} from "@libs/activityPub/activity/activities";
import {followService, statusService} from "@libs/services";

/*
    This queue will handle data headed into your instance from the Fediverse
 */

export const inboundQueueProcessor = async (event: SQSEvent) => {
    for (const message of event.Records) {
        try {
            const activity: Activity = JSON.parse(message.body) as Activity;
            console.log('Processing message:', activity);

            switch (activity.type) {
                case ActivityType.Follow:
                        await followService.acceptRequest(activity as FollowActivity);
                    break;
                case ActivityType.Create:
                        await statusService.storeCreate(activity as CreateActivity);
                    break;
                default:
                    console.warn(`I don't know how to handle ${activity.type}`);
                    break;
            }


        } catch (error) {
            console.error('Error processing message:', message.messageId, error);
        }
    }

};

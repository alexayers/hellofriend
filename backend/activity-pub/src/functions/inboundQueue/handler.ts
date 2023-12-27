import {SQSEvent} from "aws-lambda";
import {
    AcceptActivity,
    Activity,
    ActivityType, AnnounceActivity,
    CreateActivity, DeleteActivity,
    FollowActivity
} from "@libs/activityPub/activity/activities";
import {followService, inboundQueueService, statusService, timelineQueueService} from "@libs/services";
import {Status} from "@libs/model/status";
import {Account} from "@libs/model/account";

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
                    let accountStatus : {status: Status, account: Account} = await statusService.storeCreate(activity as CreateActivity);

                    if (accountStatus && !accountStatus.status.inReplyToId) {
                        await timelineQueueService.queue(accountStatus);
                    }

                    break;
                case ActivityType.Delete:

                    let deleteActivity: DeleteActivity = activity as DeleteActivity;


                    if (deleteActivity.actor == deleteActivity.object) {
                        // Deleting an account
                    } else {
                        await statusService.deleteStatus(activity as DeleteActivity)
                    }

                    break;
                case ActivityType.Accept:
                    await followService.processAccept(activity as AcceptActivity);
                    break;
                case ActivityType.Announce:

                    await statusService.boostRequest(activity as AnnounceActivity)

                    break;
                default:
                    console.warn(`I don't know how to handle ${activity.type}`);
                    break;
            }

            await inboundQueueService.deleteMessage(message.receiptHandle);

        } catch (error) {
            console.error('Error processing message:', message.messageId, error);
        }
    }

};

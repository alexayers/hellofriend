import {AcceptActivity, ActivityType, FollowActivity} from "../activityPub/activity/activities";
import {URL} from "url";
import {accountService, fediverseService} from "./index";
import {v4 as uuidv4} from 'uuid';
import {FollowerRepository} from "../repository/followerRepository";
import {followerRepository} from "../repository";
import {Account} from "../model/account";

export class FollowService {

    constructor(private domain: string, private followerRepository: FollowerRepository) {
    }

    async acceptRequest(followActivity: FollowActivity) {

        let acceptActivity: AcceptActivity = {
            "@context": "https://www.w3.org/ns/activitystreams",
            id: `https://${this.domain}/${uuidv4()}`,
            actor: followActivity.object,
            object: {
                "@context": "https://www.w3.org/ns/activitystreams",
                actor: followActivity.actor,
                id: followActivity.id,
                object: followActivity.object,
                type: ActivityType.Follow
            },
            type: ActivityType.Accept
        }

        console.debug(acceptActivity);

        const destinationActor: string = acceptActivity.object.actor
        const destinationActorUri: string = destinationActor;
        const destinationActorTokens: string[] = destinationActorUri.split("/");
        const destinationUsername: string = destinationActorTokens[destinationActorTokens.length - 1];
        const destinationHostname: string = new URL(destinationActor).hostname;

        let account : Account = await accountService.getByNormalizedUsernameDomain(destinationUsername, destinationHostname);
        await fediverseService.signedDelivery(acceptActivity, acceptActivity.object.actor);

    }
}

import {AcceptActivity, ActivityType, FollowActivity, UndoFollowActivity} from "../activityPub/activity/activities";
import {accountService, fediverseService, webFingerService} from "./index";
import {v4 as uuidv4} from 'uuid';
import {Account} from "../model/account";
import * as domain from "domain";
import {actorFromUrl} from "../helpers/actorFromUrl";

export class FollowService {

    constructor(private domain: string) {
    }

    async acceptRequest(followActivity: FollowActivity) {

        let acceptActivity: AcceptActivity = {
            "@context": "https://www.w3.org/ns/activitystreams",
            id: `https://${this.domain}/${uuidv4()}`,
            actor: followActivity.object,
            object: followActivity,
            type: ActivityType.Accept
        }

        console.debug(acceptActivity);


        let actor: { username: string, domain: string } = actorFromUrl(followActivity.actor);
        let account : Account = await accountService.getByNormalizedUsernameDomain(actor.username, actor.domain);

        /*
            We've never seen this person. We need to fetch them from the remote server and store them locally.
         */

        if (!account) {
            console.info(`I don't have an account for @${actor.username}@${actor.domain}, fetching`);
            await webFingerService.finger(actor.username,actor.domain);
        }

        await fediverseService.signedDelivery(acceptActivity, acceptActivity.object.actor);
    }

    async generateFollowRequest(fromUsername: string, destination: string) : Promise<FollowActivity> {
        let followActivity = {
            '@context': "https://www.w3.org/ns/activitystreams",
            actor: `https://www.${domain}/users/${fromUsername}`,
            id: `https://www.${domain}/${uuidv4()}`,
            object: destination,
            type: ActivityType.Follow
        }

        return followActivity;
    }

    async generateUnFollowRequest(fromUsername: string, destination: string) : Promise<UndoFollowActivity> {
        let unfollowActivity = {
            '@context': "https://www.w3.org/ns/activitystreams",
            id: `https://www.${domain}/users/${fromUsername}#follows/${uuidv4()}/undo`,
            type: ActivityType.Undo,
            actor: `https://www.${domain}/users/${fromUsername}`,
            object: {
                '@context': "https://www.w3.org/ns/activitystreams",
                actor: `https://www.${domain}/users/${fromUsername}`,
                id: `https://www.${domain}/${uuidv4()}`,
                object: destination,
                type: ActivityType.Follow
            }
        }

        return unfollowActivity;
    }

    async sendUnFollowRequest(undoFollowActivity: UndoFollowActivity) : Promise<void> {
        await fediverseService.signedDelivery(undoFollowActivity, undoFollowActivity.object.object);
    }

    async sendFollowRequest(followActivity: FollowActivity) : Promise<void> {
        await fediverseService.signedDelivery(followActivity, followActivity.object);
    }
}

import {AcceptActivity, ActivityType, FollowActivity, UndoFollowActivity} from "../activityPub/activity/activities";
import {accountService, fediverseService, outboundQueueService, webFingerService} from "./index";
import {v4 as uuidv4} from 'uuid';
import {Account} from "../model/account";
import {actorFromUrl} from "../helpers/actorFromUrl";
import {followerRepository} from "../repository";
import {Follow} from "../model/follow";
import console from "console";

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

        let you: { username: string, domain: string } = actorFromUrl(followActivity.object);
        let yourAccount: Account = await accountService.getByNormalizedUsernameDomain(you.username);

        let followerActor: { username: string, domain: string } = actorFromUrl(followActivity.actor);
        let followerAccount: Account = await accountService.getByNormalizedUsernameDomain(followerActor.username, followerActor.domain);

        /*
            We've never seen this person. We need to fetch them from the remote server and store them locally.
         */

        if (!followerAccount) {
            console.info(`I don't have an account for @${followerActor.username}@${followerActor.domain}, fetching`);
            followerAccount = await webFingerService.finger(followerActor.username, followerActor.domain);
        }

        await followerRepository.persist({
            objectName: "Follower",
            pkey: yourAccount.pkey,
            skey: `Follower#${followerAccount.pkey}`,
            uri: acceptActivity.id,
            accepted: true
        });

        await fediverseService.signedDelivery(acceptActivity, acceptActivity.object.actor);
    }


    async generateFollowRequest(fromAccountID: string, followAccountID: string): Promise<FollowActivity> {

        const promises = [
            accountService.getById(fromAccountID),
            accountService.getById(followAccountID)];

        const results = await Promise.all(promises);

        const yourAccount: Account = results[0] as unknown as Account;
        const followAccount: Account = results[1] as unknown as Account;

        let followActivity = {
            '@context': "https://www.w3.org/ns/activitystreams",
            actor: `https://www.${this.domain}/users/${yourAccount.username}`,
            id: `https://www.${this.domain}/${uuidv4()}`,
            object: followAccount.uri,
            type: ActivityType.Follow
        }

        await outboundQueueService.queue(followActivity);
        return followActivity;
    }

    async generateUnFollowRequest(fromAccountID: string, unFollowAccountID: string): Promise<UndoFollowActivity> {

        const promises = [
            accountService.getById(fromAccountID),
            accountService.getById(unFollowAccountID)];

        const results = await Promise.all(promises);

        const yourAccount: Account = results[0] as unknown as Account;
        const followAccount: Account = results[1] as unknown as Account;

        console.log(yourAccount);
        console.log(followAccount);

        let unfollowActivity = {
            '@context': "https://www.w3.org/ns/activitystreams",
            id: `https://www.${this.domain}/users/${yourAccount.username}#follows/${uuidv4()}/undo`,
            type: ActivityType.Undo,
            actor: `https://www.${this.domain}/users/${yourAccount.username}`,
            object: {
                '@context': "https://www.w3.org/ns/activitystreams",
                actor: `https://www.${this.domain}/users/${yourAccount.username}`,
                id: `https://www.${this.domain}/${uuidv4()}`,
                object: followAccount.uri,
                type: ActivityType.Follow
            }
        }

        console.log(unfollowActivity);

        await outboundQueueService.queue(unfollowActivity);
        await followerRepository.deleteFollowing(fromAccountID, unFollowAccountID);

        return unfollowActivity;
    }

    async sendUnFollowRequest(undoFollowActivity: UndoFollowActivity): Promise<void> {
        await fediverseService.signedDelivery(undoFollowActivity, undoFollowActivity.object.object);

    }

    async sendFollowRequest(followActivity: FollowActivity): Promise<void> {

        let you: { username: string, domain: string } = actorFromUrl(followActivity.actor);
        let yourAccount: Account = await accountService.getByNormalizedUsernameDomain(you.username);

        let followingActor: { username: string, domain: string } = actorFromUrl(followActivity.object);
        let followingAccount: Account = await accountService.getByNormalizedUsernameDomain(followingActor.username, followingActor.domain);

        /*
            We've never seen this person. We need to fetch them from the remote server and store them locally.
         */

        if (!followingAccount) {
            console.info(`I don't have an account for @${followingActor.username}@${followingActor.domain}, fetching`);
            followingAccount = await webFingerService.finger(followingActor.username, followingActor.domain);
        }

        await followerRepository.persist({
            objectName: "Following",
            pkey: yourAccount.pkey,
            skey: `Following#${followingAccount.pkey}`,
            uri: followActivity.id,
            accepted: false
        });

        await fediverseService.signedDelivery(followActivity, followActivity.object);
    }

    async processAccept(acceptActivity: AcceptActivity) {

        let follow: Follow = await followerRepository.getByUri(acceptActivity.object.id);

        if (follow) {
            follow.accepted = true;
            await followerRepository.persist(follow);
        }

    }

    async getFollowing(accountID: string): Promise<Array<Follow>> {
        return await followerRepository.getFollows(accountID);
    }
}

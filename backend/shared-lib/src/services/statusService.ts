import {ActivityNote, AnnounceActivity, CreateActivity, DeleteActivity} from "../activityPub/activity/activities";
import {actorFromUrl} from "../helpers/actorFromUrl";
import {
    accountService,
    bookmarkService,
    favoriteService,
    fediverseService,
    tagService,
    webFingerService
} from "./index";
import {Status} from "../model/status";
import {statusRepository} from "../repository";
import {v4 as uuidv4} from 'uuid';
import console from "console";
import {StatusTag} from "../model/statusTag";
import {Account} from "../model/account";
import {StatusDto} from "../dto/statusDto";

export class StatusService {

    constructor(private domain: string) {

    }


    async storeCreate(createActivity : CreateActivity) : Promise<{status: Status, account: Account}> {

        let actor: { username: string, domain: string } = actorFromUrl(createActivity.actor);
        let account: Account = await accountService.getByNormalizedUsernameDomain(actor.username, actor.domain);

        /*
            We've never seen this person. We need to fetch them from the remote server and store them locally.
         */

        if (!account) {
            console.info(`I don't have an account for @${actor.username}@${actor.domain}, fetching`);
            await webFingerService.finger(actor.username,actor.domain);
            account = await accountService.getByNormalizedUsernameDomain(actor.username, actor.domain);
        }

        let createNote: ActivityNote = createActivity.object as ActivityNote;
        let language: string | null = null;

        for (const key in createNote.contentMap) {
            language = key;
        }

        let status : Status = {
            pkey: uuidv4(),
            skey:  `Author#${account.pkey}`,
            objectName: "Status",
            accountId: account.pkey,
            content: createNote.content,
            conversationId: createNote.conversation,
            inReplyToAccountId: createNote.inReplyToAtomUri,
            inReplyToId: createNote.inReplyTo,
            language: language,
            published: createNote.published,
            sensitive: createNote.sensitive,
            spoilerText: createNote.summary,
            updated: createNote.updated,
            uri: createNote.atomUri,
            url: createNote.url
        }

        let createdStatus : Status = await statusRepository.persist(status);
        let tags: Map<string, string> = await tagService.saveNoteTags(createActivity.object as ActivityNote);

        const promises: Array<Promise<any>> = [];

        for (const [key, value] of tags) {

            console.debug(`Associating tag ${key} with status ${createdStatus.pkey}`);

            const promise : Promise<any> = this.tagStatus(key, createdStatus.pkey).catch(e => {
                console.error(e);
                return null;
            });

            promises.push(promise);
        }

        await Promise.all(promises);
        return {
            status: status,
            account: account
        };

    }

    private async tagStatus(tagPkey: string, statusPkey: string)  : Promise<StatusTag> {
        return await statusRepository.tagStatus({
            objectName: "Tag",
            pkey: `${tagPkey}`,
            skey: `Status#${statusPkey}`
        });
    }

    async deleteStatus(deleteActivity: DeleteActivity) : Promise<void> {

        let actor: { username: string, domain: string } = actorFromUrl(deleteActivity.actor);
        let account: Account = await accountService.getByNormalizedUsernameDomain(actor.username, actor.domain);

        //    We've never seen this person. We need to fetch them from the remote server and store them locally.

        if (!account) {
            console.info(`I don't have an account for @${actor.username}@${actor.domain}, fetching`);
            await webFingerService.finger(actor.username,actor.domain);
            account = await accountService.getByNormalizedUsernameDomain(actor.username, actor.domain);
        }

        // @ts-ignore
        let status : Status = await statusRepository.getByUri(deleteActivity.object.id);

        if (status && status.accountId == account.pkey) {
            status.deletedAt = Date.now();
            await statusRepository.persist(status);
            console.log(`Marked status ${status.pkey} as deleted`);
        }
    }

    async boostRequest(announceActivity: AnnounceActivity) {

        let actor: { username: string, domain: string } = actorFromUrl(announceActivity.actor);
        let account : Account = await accountService.getByNormalizedUsernameDomain(actor.username, actor.domain);

         if (!account) {
            console.info(`I don't have an account for @${actor.username}@${actor.domain}, fetching`);
            await webFingerService.finger(actor.username,actor.domain);
        }

        let boostedStatus : {status: Status, account: Account} = await this.fetchStatus(announceActivity.object);
        console.info(`Boosted ${boostedStatus.status.pkey}`);
    }

    private async fetchStatus(uri: string) : Promise<{status: Status, account: Account}>{

        let status : Status = await statusRepository.getByUri(uri);

        if (status) {
            console.info(`I already have the boosted message ${uri}, no need to fetch.`);
            return {
                status: status,
                account: null
            };
        }

        console.debug(`I need to download ${uri}`);

        let missingNote = await fediverseService.signedRequest("get", uri);
        let createActivity : CreateActivity = {
            "@context": undefined,
            actor: missingNote.attributedTo,
            cc: undefined,
            id: "",
            object: missingNote,
            published: undefined,
            signature: undefined,
            to: undefined,
            type: undefined
        }

        return await this.storeCreate(createActivity);
    }

    async getStatus(accountID : string, statusID: string) : Promise<StatusDto> {

        const status : Status = await statusRepository.getStatusById(statusID);

        if (!status) {
            return null;
        }

        const promises = [
            accountService.getById(status.accountId),
            bookmarkService.isBookmarked(accountID, statusID),
            favoriteService.isFavorited(accountID, statusID)
        ];

        // Use Promise.all to wait for all promises to resolve
        const results = await Promise.all(promises);

        // Extract results
        const account : Account = results[0] as unknown as Account;
        const bookmarked : boolean = results[1] as unknown as boolean;
        const favorited : boolean = results[2] as unknown as boolean;

        return {
            account: {
                avatarFilename: account?.avatarFilename,
                displayName: account.displayName,
                domain: account?.domain,
                id: account.pkey,
                username: account.username
            },
            boosted: undefined,
            id: statusID,
            isBookmark: bookmarked,
            isFavorite: favorited,
            published: status.published,
            replies: undefined,
            spoilerText: status.spoilerText,
            text: status.content,
            totalLikes: 0,
            uri: status.uri

        }
    }

    async getStatusesByAccount(accountID: string) : Promise<Array<Status>> {
        let statuses : Array<Status> = await statusRepository.getByAccountID(accountID);

        return statuses;
    }
}

import {ActivityNote, CreateActivity} from "../activityPub/activity/activities";
import {actorFromUrl} from "../helpers/actorFromUrl";
import {accountService, tagService, webFingerService} from "./index";
import {Status} from "../model/status";
import {statusRepository} from "../repository";
import {v4 as uuidv4} from 'uuid';
import console from "console";
import {StatusTag} from "../model/statusTag";

export class StatusService {

    async storeCreate(createActivity : CreateActivity) : Promise<void> {

        let actor: { username: string, domain: string } = actorFromUrl(createActivity.actor);
        let account = await accountService.getByNormalizedUsernameDomain(actor.username, actor.domain);

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

    }

    private async tagStatus(tagPkey: string, statusPkey: string)  : Promise<StatusTag> {
        return await statusRepository.tagStatus({
            pkey: statusPkey,
            skey: `Tag#${tagPkey}`
        });
    }
}

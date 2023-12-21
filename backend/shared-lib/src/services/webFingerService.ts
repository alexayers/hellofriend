import {accountService, fediverseService, tagService} from "./index";
import {PersonActor} from "../activityPub/actors/personActor";
import {Account} from "../model/account";

export interface FingerResponse {
    subject: string,
    aliases: Array<string>,
    links: Array<FingerLinkResponse>
}

export interface FingerLinkResponse {
    rel: string
    type: string
    href?: string
    template?: string
}

export class WebFingerService {

    async finger(username: string, domain: string) : Promise<Account> {
        let webFingerUrl: string = `https://${domain}/.well-known/webfinger?resource=acct:${username}@${domain}`;
        console.debug(`WebFinger: ${webFingerUrl}`);
        let response = await fediverseService.signedRequest("get", webFingerUrl);
        let person: PersonActor | undefined;

        if (!response) {
            return undefined;
        } else {
            console.log(person);
        }

        let fingerResponse: FingerResponse = response as FingerResponse;
        let accountUrl: string | undefined;

        for (const link  of fingerResponse.links) {
            if (link.type == "application/activity+json") {
                accountUrl = link.href;
                break;
            }
        }

        let account: Account;

        if (accountUrl) {
            response = await fediverseService.signedRequest("get", accountUrl);
            person = response as PersonActor;
            account = await accountService.persistPerson(person, domain);
            await tagService.saveAccountTags(person);
        }

        return account;
    }

}

import {accountService, fediverseService, fileSystemService, tagService} from "./index";
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

    async finger(username: string, domain: string): Promise<Account> {

        let cachedAccount: Account = await accountService.getByNormalizedUsernameDomain(username, domain);

        /*
            If we already have the account, and if it's more recent than 30 days, then just return what we
            already have cached.
         */

        if (cachedAccount) {
            if (!this.shouldRefreshAccount(cachedAccount)) {
                console.debug(`Account ${cachedAccount.username} has already been cached.`);
                return cachedAccount;
            } else {
                console.log(`Account ${cachedAccount.username} has already been cached, but needs to be refreshed`)
            }
        }

        // Send a web finger request

        let webFingerUrl: string = `https://${domain}/.well-known/webfinger?resource=acct:${username}@${domain}`;
        console.debug(`WebFinger: ${webFingerUrl}`);
        let response: PersonActor = await fediverseService.signedRequest("get", webFingerUrl);
        let person: PersonActor | undefined;

        if (!response) {
            return undefined;
        } else {
            console.log(person);
        }

        let fingerResponse: FingerResponse = response as unknown as FingerResponse;
        let accountUrl: string | undefined;

        for (const link of fingerResponse.links) {
            if (link.type == "application/activity+json") {
                accountUrl = link.href;
                break;
            }
        }

        let account: Account;

        // Send an actor request

        if (accountUrl) {
            response = await fediverseService.signedRequest("get", accountUrl);
            person = response as PersonActor;
            person.uri = accountUrl;

            const processingPromises = [];

            processingPromises.push(tagService.saveAccountTags(person));
            processingPromises.push(fileSystemService.processPerson(person));

            const processingResults = await Promise.all(processingPromises);
            person = processingResults[1];

            if (cachedAccount) {

                // Remove the old files

                const promises = [
                    accountService.updatePerson(cachedAccount, person, domain),
                    fileSystemService.delete(cachedAccount.avatarFilename),
                    fileSystemService.delete(cachedAccount.headerFilename)];

                const results = await Promise.all(promises);

                account = results[0] as unknown as Account;
            } else {
                account = await accountService.persistPerson(person, domain);
            }
        }

        return account;
    }

    private shouldRefreshAccount(account: Account): boolean {

        if (!account.webFingeredAt) {
            console.error("WebFingeredAt is null or undefined.");
            return true;
        }

        const currentDate: number = Date.now();
        const lastWebfingeredDate: number = account.webFingeredAt;
        const daysDifference: number = (currentDate - lastWebfingeredDate) / (1000 * 3600 * 24);

        return daysDifference > 30;
    }
}

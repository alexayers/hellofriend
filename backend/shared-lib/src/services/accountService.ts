import {Account} from "../model/account";
import {RegisterUser} from "../model/authenticationDtos";
import * as process from "process";
import {generateKeyPairSync} from 'crypto';
import {PersonActor} from "../activityPub/actors/personActor";
import {accountRepository, statusRepository} from "../repository";
import {v4 as uuidv4} from 'uuid';
import {Follow} from "../model/follow";
import {followService} from "./index";
import {Status} from "../model/status";

export class AccountService {



    async createAccount(registerUser: RegisterUser, sub: string): Promise<Account> {

        let keys: { privateKey: string, publicKey: string } = this.generatedKeys();

        let account: Account = {
            pkey: sub,
            skey: `Account#${registerUser.username.toLowerCase()}`,
            objectName: 'Account',
            displayName: registerUser.displayName,
            summary: "",
            url: `https://www.${process.env.DOMAIN}/@${registerUser.username}`,
            uri: `https://www.${process.env.DOMAIN}/users/${registerUser.username}`,
            followersUrl: `https://api.${process.env.DOMAIN}/${registerUser.username}/followers`,
            inboxUrl: `https://api.${process.env.DOMAIN}/${registerUser.username}/inbox`,
            outboxUrl: `https://api.${process.env.DOMAIN}/${registerUser.username}/outbox`,
            sharedInboxUrl: `https://api.${process.env.DOMAIN}/${registerUser.username}/shared-inbox`,
            headerFilename: `headers/default.png`,
            avatarFilename: `avatars/default.png`,
            username: registerUser.username,
            publicKey: keys.publicKey,
            privateKey: keys.privateKey,
            indexable: true,
            discoverable: true,
            memorial: false,
            normalizedUserDomain: `${registerUser.username.toLowerCase()}`
        }

        await accountRepository.persist(account);
        delete account.privateKey;
        return account;
    }

    async updatePerson(account: Account, person: PersonActor, domain: string) {
        account = {
            ...account,
            displayName: person.name,
            followersUrl: `https://${domain}/${person.preferredUsername}/followers`,
            inboxUrl: `https://${domain}/${person.preferredUsername}/inbox`,
            outboxUrl: `https://${domain}/${person.preferredUsername}/outbox`,
            sharedInboxUrl: `https://${domain}/${person.preferredUsername}/shared-inbox`,
            url: person.url,
            uri: person.uri,
            summary: person.summary,
            webFingeredAt: Date.now(),
            headerFilename: person.image.filename,
            headerRemotePath: person.image.url,
            headerFileType: person.image.mediaType,
            avatarFilename: person.icon.filename,
            avatarRemotePath: person.icon.url,
            avatarFileType: person.icon.mediaType,
            username: person.preferredUsername,
            publicKey: person.publicKey.publicKeyPem,
            indexable: true,
            discoverable: true,
            memorial: false
        }

        await accountRepository.persist(account);
        delete account.privateKey;
        return account;
    }

    async persistPerson(person: PersonActor, domain: string) : Promise<Account> {
        let account: Account = {
            pkey: uuidv4(),
            skey: `Account#${person.preferredUsername.toLowerCase()}:${domain}`,
            objectName: 'Account',
            displayName: person.name,
            followersUrl: `https://${domain}/${person.preferredUsername}/followers`,
            inboxUrl: `https://${domain}/${person.preferredUsername}/inbox`,
            outboxUrl: `https://${domain}/${person.preferredUsername}/outbox`,
            sharedInboxUrl: `https://${domain}/${person.preferredUsername}/shared-inbox`,
            summary: person.summary,
            webFingeredAt: Date.now(),
            url: person.url,
            uri: person.uri,
            headerFilename: person.image?.filename,
            headerRemotePath: person.image?.url,
            headerFileType: person.image?.mediaType,
            avatarFilename: person.icon?.filename,
            avatarRemotePath: person.icon?.url,
            avatarFileType: person.icon?.mediaType,
            username: person.preferredUsername,
            publicKey: person.publicKey.publicKeyPem,
            indexable: true,
            discoverable: true,
            memorial: false,
            normalizedUserDomain: `${person.preferredUsername.toLowerCase()}:${domain}`
        }

        await accountRepository.persist(account);
        delete account.privateKey;
        return account;
    }


    async getByNormalizedUsernameDomain(username: string, domain: string | null = null): Promise<Account> {

        if (!domain) {
            return await accountRepository.getByNormalizedUsernameDomain(`${username.toLowerCase()}`);
        } else {
            return await accountRepository.getByNormalizedUsernameDomain(`${username.toLowerCase()}:${domain.toLowerCase()}`);
        }
    }

    private generatedKeys(): { privateKey: string, publicKey: string } {

        const {privateKey, publicKey} = generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        return {
            privateKey: privateKey.toString(),
            publicKey: publicKey.toString()
        };
    }


    async pinStatus(accountID: string, statusID: string): Promise<boolean> {

        const status : Status = await statusRepository.getStatusById(statusID);

        if (!status) {
            return false;
        }

        await accountRepository.pinStatus(accountID, statusID);
        return true;
    }

    async unpinStatus(accountID : string, statusID: string) : Promise<boolean> {

        const status : Status = await statusRepository.getStatusById(statusID);

        if (!status) {
            return false;
        }

        await accountRepository.unpinStatus(accountID, statusID);
        return true;
    }

    async getById(accountID: string) : Promise<Account> {
        return await accountRepository.byId(accountID);
    }


    async getFollowing(accountID: string) {
        let follows : Array<Follow> = await followService.getFollowing(accountID);


    }
}

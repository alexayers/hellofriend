import {Account} from "../model/account";
import {AccountRepository} from "../repository/accountRepository";
import {RegisterUser} from "../model/authenticationDtos";
import * as process from "process";
import {generateKeyPairSync} from 'crypto';

export class AccountService {

    constructor(private accountRepository: AccountRepository) {
    }

    async createAccount(registerUser: RegisterUser): Promise<Account> {

        let keys: { privateKey: string, publicKey: string } = this.generatedKeys();

        let account: Account = {
            displayName: registerUser.displayName,
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

        await this.accountRepository.persist(account);
        delete account.privateKey;
        return account;
    }


    async getByNormalizedUsernameDomain(username: string, domain: string | null = null): Promise<Account> {

        if (!domain) {
            return await this.accountRepository.getByNormalizedUsernameDomain(`${username.toLowerCase()}`);
        } else {
            return await this.accountRepository.getByNormalizedUsernameDomain(`${username.toLowerCase()}:${domain.toLowerCase()}`);
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
}

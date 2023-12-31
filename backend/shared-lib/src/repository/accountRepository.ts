import {GenericRepository} from "./genericRepository";
import {Account} from "../model/account";
import {BaseRepository} from "./baseRepository";

export class AccountRepository extends BaseRepository implements GenericRepository<Account> {

    private _tableName: string = process.env.ACCOUNTS_TABLE;

    async persist(account: Account): Promise<Account> {
        return await this.put(this._tableName, account) as Account;
    }

    async getByPkey(pkey: string): Promise<Account> {
        return await super.byPkey(this._tableName, pkey) as Account;
    }

    async getByNormalizedUsernameDomain(search: string): Promise<Account> {

        const params = {
            TableName: this._tableName,
            IndexName: 'normalized-user-domain-index',
            KeyConditionExpression: 'normalizedUserDomain = :value',
            ExpressionAttributeValues: {
                ':value': search
            }
        }

        return await super.queryForOne(params) as Account;
    }

    async pinStatus(accountID: string, statusID: string) {
        return await this.put(this._tableName, {
            pkey: accountID,
            skey: `StatusPin#${statusID}`
        });
    }

    async unpinStatus(accountID: string, statusID: string) {
        await this.deleteItemByPkeyAndSkey(this._tableName, accountID, `StatusPin#${statusID}`);
    }


    async byId(accountID: string): Promise<Account> {
        let results = await this.byPkeyAndPartialSkey(this._tableName, accountID, "Account");

        if (results && results.length == 1) {
            return results[0];
        } else {
            return null;
        }
    }


}

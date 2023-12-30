import {BaseRepository, documentClient} from "./baseRepository";
import {GenericRepository} from "./genericRepository";
import {Status} from "../model/status";
import {StatusTag} from "../model/statusTag";
import {QueryCommand, QueryCommandOutput} from "@aws-sdk/lib-dynamodb";
import console from "console";


export class StatusRepository extends BaseRepository implements GenericRepository<Status> {

    private _tableName: string = process.env.STATUSES_TABLE;

    async persist(status: Status): Promise<Status> {

        if (!status.inReplyToAccountId) {
            delete status.inReplyToAccountId
        }

        if (!status.inReplyToId) {
            delete status.inReplyToId;
        }

        if (!status.spoilerText) {
            delete status.spoilerText;
        }

        if (!status.updated) {
            delete status.updated;
        }

        return await this.put(this._tableName, status) as Status;

    }

    async getByPkey(pkey: string): Promise<Status> {
        return await super.byPkey(this._tableName, pkey) as Status;
    }

    async tagStatus(statusTag: StatusTag): Promise<StatusTag> {
        return await this.put(this._tableName, statusTag) as StatusTag;
    }

    async getByUri(uri: string): Promise<Status> {
        const params = {
            TableName: this._tableName,
            IndexName: 'uri-index',
            KeyConditionExpression: 'uri = :value',
            ExpressionAttributeValues: {
                ':value': uri
            }
        }

        return await super.queryForOne(params) as Status;
    }

    async deleteByConversation(conversationId: string): Promise<void> {

    }

    async getStatusById(statusID: string): Promise<Status> {
        const params = {
            TableName: this._tableName,
            KeyConditionExpression: "#pkey = :pkey AND begins_with(#skey, :prefix)",
            ExpressionAttributeNames: {
                "#pkey": "pkey",
                "#skey": "skey"
            },
            ExpressionAttributeValues: {
                ":pkey": statusID,
                ":prefix": "Author"
            }
        };

        console.log(params);

        try {
            const data: QueryCommandOutput = await documentClient.send(new QueryCommand(params));

            if (data.Items.length == 1) {
                return data.Items[0] as Status;
            } else {
                return undefined;
            }

        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

    async getByAccountID(accountID: string): Promise<Array<Status>> {

        const params = {
            TableName: this._tableName,
            IndexName: 'account-index',
            KeyConditionExpression: 'accountId = :value',
            ExpressionAttributeValues: {
                ':value': accountID
            }
        }


        return await super.query(params) as Array<Status>;
    }
}

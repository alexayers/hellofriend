import {BaseRepository} from "./baseRepository";
import {GenericRepository} from "./genericRepository";
import {Status} from "../model/status";
import {StatusTag} from "../model/statusTag";
import {Follow} from "../model/follow";


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

        return await this.put(this._tableName, status) as Status;
    }

    async getByPkey(pkey: string) : Promise<Status> {
        return await super.byPkey(this._tableName, pkey) as Status;
    }

    async tagStatus(statusTag: StatusTag) : Promise<StatusTag> {
        return await this.put(this._tableName, statusTag) as StatusTag;
    }

    async getByUri(uri: string) : Promise<Status> {
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
}

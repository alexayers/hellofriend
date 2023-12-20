import {BaseRepository} from "./baseRepository";
import {GenericRepository} from "./genericRepository";
import {Status} from "../model/status";
import {StatusTag} from "../model/statusTag";


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
}

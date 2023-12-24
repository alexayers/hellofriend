import {BaseRepository} from "./baseRepository";
import {GenericRepository} from "./genericRepository";
import {Follow} from "../model/follow";
import * as process from "process";


export class FollowerRepository extends BaseRepository implements GenericRepository<Follow> {

    private _tableName: string = process.env.FOLLOWS_TABLE;

    async persist(follow: Follow): Promise<Follow> {
        return await this.put(this._tableName, follow) as Follow;
    }

    async getByPkey(pkey: string): Promise<Follow> {
        return await super.byPkey(this._tableName, pkey) as Follow;
    }

    async getByUri(uri: string): Promise<Follow> {
        const params = {
            TableName: this._tableName,
            IndexName: 'uri-index',
            KeyConditionExpression: 'uri = :value',
            ExpressionAttributeValues: {
                ':value': uri
            }
        }

        return await super.queryForOne(params) as Follow;
    }
}

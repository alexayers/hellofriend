import {BaseRepository} from "./baseRepository";
import {GenericRepository} from "./genericRepository";
import {Follower} from "../model/follower";
import * as process from "process";


export class FollowerRepository extends BaseRepository implements GenericRepository<Follower> {

    private _tableName: string = process.env.FOLLOW_TABLE;

    async persist(follower: Follower): Promise<Follower> {

        return null;

    }

    async getByPkey(pkey: string) : Promise<Follower> {
        return await super.byPkey(this._tableName, pkey) as Follower;
    }
}

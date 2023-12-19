import {BaseRepository, documentClient} from "./baseRepository";
import {GenericRepository} from "./genericRepository";
import {Follower} from "../model/follower";
import * as process from "process";
import {PutCommand} from "@aws-sdk/lib-dynamodb";


export class FollowerRepository extends BaseRepository implements GenericRepository<Follower> {

    private _tableName: string = process.env.FOLLOW_TABLE;

    async persist(follower: Follower): Promise<Follower> {

        return null;

    }
}

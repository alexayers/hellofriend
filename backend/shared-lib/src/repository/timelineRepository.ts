import {BaseRepository, documentClient} from "./baseRepository";
import {GenericRepository} from "./genericRepository";
import {TimeLineEntry} from "../model/timeLineEntry";
import console from "console";
import {PutCommand} from "@aws-sdk/lib-dynamodb";


export class TimelineRepository extends BaseRepository implements GenericRepository<TimeLineEntry> {

    private _tableName: string = process.env.TIMELINE_TABLE;

    async persist(timeLineEntry: TimeLineEntry): Promise<TimeLineEntry> {


        timeLineEntry = {
            createdAt: Date.now(),
            modifiedAt: Date.now(),
            expiresAt: Math.floor(Date.now() / 1000) + (5 * 24 * 60 * 60),
            pkey: this.getCurrentDateFormatted(new Date()),
            skey: Date.now(),
            ...timeLineEntry
        };


        console.log({
            TableName: this._tableName,
            Item: timeLineEntry
        });

        try {
            const command: PutCommand = new PutCommand({
                TableName: this._tableName,
                Item: timeLineEntry
            });

            await documentClient.send(command);
        } catch (e) {
            console.error(e);
        }


        return timeLineEntry;
    }

    getByPkey(pkey: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

}

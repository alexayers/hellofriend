import {BaseRepository} from "./baseRepository";
import {GenericRepository} from "./genericRepository";
import {Tag} from "../model/tag";
import {TimeSeries} from "../model/timeSeries";


export class TimeSeriesRepository extends BaseRepository implements GenericRepository<TimeSeries> {

    private _tableName : string = process.env.TIMESERIES_TABLE;

    persist(timeSeries: TimeSeries): Promise<TimeSeries> {
        throw new Error("Method not implemented.");
    }
    getByPkey(pkey: string): Promise<any> {
        throw new Error("Method not implemented.");
    }


    async getRecentByObjectName(objectName: string) : Promise<any> {
        const params = {
            TableName: this._tableName,
            IndexName: 'object-index',
            KeyConditionExpression: 'objectName = :value',
            ExpressionAttributeValues: {
                ':value': objectName
            },
            ScanIndexForward: false,
            Limit: 50
        }

        return await super.query(params);
    }
}

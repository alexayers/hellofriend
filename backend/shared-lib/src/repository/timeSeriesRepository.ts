import {BaseRepository} from "./baseRepository";
import {GenericRepository} from "./genericRepository";
import {Tag} from "../model/tag";
import {TimeSeries} from "../model/timeSeries";


export class TimeSeriesRepository extends BaseRepository implements GenericRepository<TimeSeries> {

    persist(timeSeries: TimeSeries): Promise<TimeSeries> {
        throw new Error("Method not implemented.");
    }
    getByPkey(pkey: string): Promise<any> {
        throw new Error("Method not implemented.");
    }



}

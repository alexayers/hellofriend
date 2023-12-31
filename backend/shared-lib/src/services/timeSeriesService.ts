import {timeSeriesRepository} from "../repository";

export class TimeSeriesService {


    async getRecent(objectName: string): Promise<Array<any>> {
        let results = await timeSeriesRepository.getRecentByObjectName(objectName);

        if (!results) {
            return [];
        }

        let objects: Array<any> = [];
        let pkeySet: Set<string> = new Set<string>();

        for (const obj of results) {

            if (obj.object && !pkeySet.has(obj.object.pkey)) {
                pkeySet.add(obj.object.pkey);
                objects.push(obj.object);
            }
        }

        return objects;
    }


}


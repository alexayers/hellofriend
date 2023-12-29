import {TimeLineEntry} from "../model/timeLineEntry";
import {timelineRepository} from "../repository";

export class TimelineService {

    async process(timeLineEntry: TimeLineEntry) {

        await timelineRepository.persist(timeLineEntry);
    }
}

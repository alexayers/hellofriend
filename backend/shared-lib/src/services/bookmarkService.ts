import {Bookmark} from "../model/bookmark";
import {bookmarkResository, statusRepository} from "../repository";
import {StatusDto} from "../dto/statusDto";
import {Status} from "../model/status";


export class BookmarkService {

    async addBookmark(accountID: string, statusID: string) : Promise<Bookmark> {

        const status : Status = await statusRepository.getStatusById(statusID);

        if (!status) {
            return null;
        }

        return await bookmarkResository.persist({
            objectName: "Bookmark",
            pkey: accountID,
            skey: statusID}
        );
    }

    async removeBookmark(accountID: string, statusID: string) : Promise<boolean> {

        const status : Status = await statusRepository.getStatusById(statusID);

        if (!status) {
            return false;
        }

        await bookmarkResository.delete(accountID, statusID);
    }

    async getBookmarks(accountID: string) : Promise<Array<StatusDto>> {
        return await bookmarkResository.getBookmarks(accountID) as Array<StatusDto>;
    }

    async isBookmarked(accountID: string, statusID: string) {
        return await bookmarkResository.isBookmarked(accountID, statusID);
    }
}

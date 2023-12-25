import {Bookmark} from "../model/bookmark";
import {bookmarkResository} from "../repository";
import {StatusDto} from "../dto/statusDto";


export class BookmarkService {

    async addBookmark(accountID: string, statusID: string) : Promise<Bookmark> {
        return await bookmarkResository.persist({
            pkey: accountID,
            skey: statusID}
        );
    }

    async removeBookmark(accountID: string, statusID: string) : Promise<void> {
        await bookmarkResository.delete(accountID, statusID);
    }

    async getBookmarks(accountID: string) : Promise<Array<StatusDto>> {
        return await bookmarkResository.getBookmarks(accountID) as Array<StatusDto>;
    }

    async isBookmarked(accountID: string, statusID: string) {
        return await bookmarkResository.isBookmarked(accountID, statusID);
    }
}

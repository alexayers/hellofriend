import {Bookmark} from "../model/bookmark";
import {bookmarkResository} from "../repository";


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

    async getBookmarks(accountID: string) : Promise<Array<Bookmark>> {
        return [];
    }

    async isBookmarked(accountID: string, statusID: string) {
        return await bookmarkResository.isBookmarked(accountID, statusID);
    }
}

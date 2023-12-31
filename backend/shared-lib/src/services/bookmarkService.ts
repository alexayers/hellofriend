import {Bookmark} from "../model/bookmark";
import {bookmarkResository, statusRepository} from "../repository";
import {StatusDto} from "../dto/statusDto";
import {Status} from "../model/status";


export class BookmarkService {

    async addBookmark(accountID: string, statusID: string): Promise<Bookmark> {

        const status: Status = await statusRepository.getStatusById(statusID);

        if (!status) {
            return null;
        }

        console.log(`Status found ${status.pkey}`)

        return await bookmarkResository.persist({
                objectName: "Bookmark",
                pkey: accountID,
                skey: statusID,
                status: {
                    account: status.account,
                    id: status.pkey,
                    text: status.content,
                    spoilerText: status.spoilerText,
                    published: status.published,
                    uri: status.uri,
                    totalLikes: 0,
                    isFavorite: false,
                    isBookmark: true
                }
            }
        );
    }

    async removeBookmark(accountID: string, statusID: string): Promise<boolean> {

        const status: Status = await statusRepository.getStatusById(statusID);

        if (!status) {
            return false;
        }

        await bookmarkResository.delete(accountID, statusID);
    }

    async getBookmarks(accountID: string): Promise<Array<Bookmark>> {
        return await bookmarkResository.getBookmarks(accountID);
    }

    async isBookmarked(accountID: string, statusID: string) {
        return await bookmarkResository.isBookmarked(accountID, statusID);
    }
}

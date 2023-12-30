import {BaseRepository} from "./baseRepository";
import {GenericRepository} from "./genericRepository";
import {Bookmark} from "../model/bookmark";


export class BookmarkRepository extends BaseRepository implements GenericRepository<Bookmark> {

    private _tableName: string = process.env.ACCOUNTS_TABLE;

    async persist(bookMark: Bookmark): Promise<Bookmark> {

        return await this.put(this._tableName, {
            pkey: bookMark.pkey,
            skey: `Bookmark#${bookMark.skey}`
        }) as Bookmark;
    }

    async getByPkey(pkey: string): Promise<Array<Bookmark>> {
        throw new Error("Method not implemented.");
    }

    async delete(accountID: string, statusID: string): Promise<boolean> {
        return await this.deleteItemByPkeyAndSkey(this._tableName, accountID, `Bookmark#${statusID}`);
    }

    async isBookmarked(accountID: string, statusID: string): Promise<boolean> {
        let bookmark = await super.byPkeyAndSkey(
            this._tableName,
            accountID,
            `Bookmark#${statusID}`
        );

        return !!bookmark;
    }

    async getBookmarks(accountID: string) {
        return await super.byPkeyAndPartialSkey(this._tableName, accountID, "Bookmark#");
    }
}

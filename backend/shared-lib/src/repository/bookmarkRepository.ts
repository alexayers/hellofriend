import {BaseRepository, documentClient} from "./baseRepository";
import {GenericRepository} from "./genericRepository";
import {Bookmark} from "../model/bookmark";
import {BatchGetItemCommand} from "@aws-sdk/client-dynamodb";


export class BookmarkRepository extends BaseRepository implements GenericRepository<Bookmark> {

    private _tableName: string = process.env.ACCOUNTS_TABLE;

    async persist(bookMark: Bookmark): Promise<Bookmark> {

        if (!bookMark.status.spoilerText) {
            delete bookMark.status.spoilerText;
        }

        return await this.put(this._tableName, {
            pkey: bookMark.pkey,
            skey: `Bookmark#${bookMark.skey}`,
            status: bookMark.status
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
    

    async getBookmarks(accountID: string) : Promise<Array<Bookmark>> {
        return await super.byPkeyAndPartialSkey(this._tableName, accountID, "Bookmark#") as unknown as Array<Bookmark>;
    }

    async areBookmarked(accountID: string, statusIDs: string[]): Promise<boolean[]> {

        const BATCH_SIZE :number = 100;
        const chunks = [];
        for (let i: number = 0; i < statusIDs.length; i += BATCH_SIZE) {
            chunks.push(statusIDs.slice(i, i + BATCH_SIZE));
        }

        let bookmarkedStatuses = [];
        for (const chunk of chunks) {
            let keys = chunk.map(statusID => ({
                pkey: { S: accountID },
                skey: { S: `Bookmark#${statusID}` }
            }));

            const params = {
                RequestItems: {
                    [this._tableName]: {
                        Keys: keys
                    }
                }
            };

            try {
                const data = await documentClient.send(new BatchGetItemCommand(params));
                let results = data.Responses[this._tableName];

                const chunkBookmarked = chunk.map(statusID =>
                    results.some(item => item.skey.S === `Bookmark#${statusID}`)
                );

                bookmarkedStatuses.push(...chunkBookmarked);
            } catch (error) {
                console.error("Error:", error);
                throw error;
            }
        }

        return bookmarkedStatuses;
    }
}

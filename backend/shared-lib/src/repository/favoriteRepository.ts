import {BaseRepository, documentClient} from "./baseRepository";
import {GenericRepository} from "./genericRepository";
import {Favorite} from "../model/favorite";
import {Bookmark} from "../model/bookmark";
import {BatchGetItemCommand} from "@aws-sdk/client-dynamodb";


export class FavoriteRepository extends BaseRepository implements GenericRepository<Favorite> {

    private _tableName: string = process.env.ACCOUNTS_TABLE;

    async persist(favorite: Favorite): Promise<Favorite> {

        if (!favorite.status.spoilerText) {
            delete favorite.status.spoilerText;
        }


        return await this.put(this._tableName, {
            pkey: favorite.pkey,
            skey: `Favorite#${favorite.skey}`,
            status: favorite.status
        }) as Favorite;
    }

    async getByPkey(pkey: string): Promise<Array<Favorite>> {
        throw new Error("Method not implemented.");
    }

    async delete(accountID: string, statusID: string) {
        return await this.deleteItemByPkeyAndSkey(this._tableName, accountID, `Favorite#${statusID}`);
    }

    async isFavorited(accountID: string, statusID: string): Promise<boolean> {
        let favorite = await super.byPkeyAndSkey(
            this._tableName,
            accountID,
            `Favorite#${statusID}`
        );

        return !!favorite;
    }

    async getFavorites(accountID: string) : Promise<Array<Favorite>> {
        return await super.byPkeyAndPartialSkey(this._tableName, accountID, "Favorite#") as unknown as Array<Favorite>;
    }

    async areFavorited(accountID: string, statusIDs: string[]): Promise<boolean[]> {

        const BATCH_SIZE : number = 100;
        const chunks = [];
        for (let i : number = 0; i < statusIDs.length; i += BATCH_SIZE) {
            chunks.push(statusIDs.slice(i, i + BATCH_SIZE));
        }

        let favoritedStatuses = [];
        for (const chunk of chunks) {
            let keys = chunk.map(statusID => ({
                pkey: { S: accountID },
                skey: { S: `Favorite#${statusID}` }
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

                const chunkFavorited = chunk.map(statusID =>
                    results.some(item => item.skey.S === `Favorite#${statusID}`)
                );

                favoritedStatuses.push(...chunkFavorited);
            } catch (error) {
                console.error("Error:", error);
                throw error;
            }
        }

        return favoritedStatuses;
    }
}

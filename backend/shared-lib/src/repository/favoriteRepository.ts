import {BaseRepository} from "./baseRepository";
import {GenericRepository} from "./genericRepository";
import {Favorite} from "../model/favorite";
import {Bookmark} from "../model/bookmark";


export class FavoriteRepository extends BaseRepository implements GenericRepository<Favorite> {

    private _tableName: string = process.env.ACCOUNTS_TABLE;

    async persist(favorite: Favorite): Promise<Favorite> {
        return await this.put(this._tableName, {
            pkey: favorite.pkey,
            skey: `Favorite#${favorite.skey}`
        }) as Bookmark;
    }

    async getByPkey(pkey: string): Promise<Array<Favorite>> {
        throw new Error("Method not implemented.");
    }

    async delete(accountID: string, statusID: string) {
        return await this.deleteItemByPkeyAndSkey(this._tableName, accountID, `Favorite#${statusID}`);
    }

    async isFavorited(accountID: string, statusID: string) : Promise<boolean> {
        let favorite = await super.byPkeyAndSkey(
            this._tableName,
            accountID,
            `Favorite#${statusID}`
        );

        return !!favorite;
    }
}

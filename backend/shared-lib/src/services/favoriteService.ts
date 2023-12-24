import {Favorite} from "../model/favorite";
import  {favoriteRepository} from "../repository";


export class FavoriteService {

    async addFavorite(accountID: string, statusID: string) : Promise<Favorite> {
        return await favoriteRepository.persist({
            pkey: accountID,
            skey: statusID}
        );
    }

    async removeFavorite(accountID: string, statusID: string) : Promise<boolean> {
        return await favoriteRepository.delete(accountID, statusID);
    }

    async getFavorites(accountID: string) : Promise<Array<Favorite>> {
        return [];
    }
}

import {Favorite} from "../model/favorite";
import {favoriteRepository} from "../repository";
import {StatusDto} from "../dto/statusDto";


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

    async getFavorites(accountID: string) : Promise<Array<StatusDto>> {
        return await favoriteRepository.getFavorites(accountID) as Array<StatusDto>;
    }

    async isFavorited(accountID: string, statusID: string) {
        return await favoriteRepository.isFavorited(accountID, statusID);
    }
}

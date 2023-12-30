import {Favorite} from "../model/favorite";
import {favoriteRepository, statusRepository} from "../repository";
import {StatusDto} from "../dto/statusDto";
import {Status} from "../model/status";


export class FavoriteService {

    async addFavorite(accountID: string, statusID: string): Promise<Favorite> {

        const status: Status = await statusRepository.getStatusById(statusID);

        if (!status) {
            return null;
        }

        return await favoriteRepository.persist({
                objectName: "Favorite",
                pkey: accountID,
                skey: statusID
            }
        );
    }

    async removeFavorite(accountID: string, statusID: string): Promise<boolean> {

        const status: Status = await statusRepository.getStatusById(statusID);

        if (!status) {
            return false;
        }

        return await favoriteRepository.delete(accountID, statusID);
    }

    async getFavorites(accountID: string): Promise<Array<StatusDto>> {
        return await favoriteRepository.getFavorites(accountID) as Array<StatusDto>;
    }

    async isFavorited(accountID: string, statusID: string) {
        return await favoriteRepository.isFavorited(accountID, statusID);
    }
}
